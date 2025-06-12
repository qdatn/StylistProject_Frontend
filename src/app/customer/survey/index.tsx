import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@redux/store';
import axiosClient from '@api/axiosClient';
import { UserAccount } from '@src/types/UserAccount';
import { StylePreference } from '@src/types/StylePreferences';
import FashionSurveyForm from '@components/FashionSurveyForm';
import { notification } from 'antd';

const apiUrl = import.meta.env.VITE_API_URL;

const FashionSurveyPage = () => {
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);

    const dispatch: AppDispatch = useDispatch();
    const currentUserId: string = useSelector(
        (state: RootState) => state.persist.auth.user?.user._id as string
    );

    // Fetch user data
    async function fetchUser(userId: string): Promise<UserAccount> {
        try {
            const response = await axiosClient.getOne<UserAccount>(
                `${apiUrl}/api/userinfo/${currentUserId}`
            );
            return response;
        } catch (error) {
            console.error("Error fetching user:", error);
            throw error;
        }
    }

    useEffect(() => {
        const loadCurrentUser = async () => {
            try {
                if (currentUserId) {
                    const userInfo = await fetchUser(currentUserId);
                    setCurrentUser(userInfo);
                    setLoading(false);
                }
            } catch (error) {
                console.error('Failed to load user:', error);
                setError('Failed to load user data. Please try again later.');
                setLoading(false);
            }
        };

        loadCurrentUser();
    }, [currentUserId]);

    // Handle form submission
    const handleSubmit = async (formData: Partial<StylePreference>) => {
        setSubmitting(true);
        setError(null);

        try {
            if (!currentUser?.style_preferences?._id) {
                const response = await axiosClient.post<StylePreference>(
                    `${apiUrl}/api/style-preferences`,
                    formData
                );
                const responseUpdate = await axiosClient.put<UserAccount>(
                    `${apiUrl}/api/userinfo/${currentUserId}`,
                    {
                        style_preferences: response._id
                    });

                // Update local state with new data
                setCurrentUser(prev => ({
                    ...prev!,
                    style_preferences: {
                        ...prev!.style_preferences,
                        ...response
                    }
                }));
            }
            else {

                const response = await axiosClient.put<StylePreference>(
                    `${apiUrl}/api/style-preferences/${currentUser.style_preferences._id}`,
                    formData
                );

                // Update local state with new data
                setCurrentUser(prev => ({
                    ...prev!,
                    style_preferences: {
                        ...prev!.style_preferences,
                        ...response
                    }
                }));
            }

            notification.success({
                message: "Survey saved successfully!",
                description: "",
                placement: "topRight",
                duration: 2,
            });

        } catch (error) {
            console.error('Submission error:', error);
            setError('Failed to update preferences. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    // Map object to handle outfitsByOccasion
    const mapToObject = (map: Map<string, string> | Record<string, string> | undefined): Record<string, string> => {
        if (!map) return {};
        if (map instanceof Map) {
            const obj: Record<string, string> = {};
            map.forEach((value, key) => {
                obj[key] = value;
            });
            return obj;
        }
        return map;
    };

    // Prepare initial form data
    const getInitialFormData = () => {
        if (!currentUser?.style_preferences) return undefined;

        const sp = currentUser.style_preferences;

        return {
            personalInfo: {
                occupation: sp.occupation,
                location: sp.location,
                height: sp.height,
                weight: sp.weight
            },
            fashionStyle: {
                favoriteStyles: sp.favoriteStyles || [],
                outfitsByOccasion: mapToObject(sp.outfitsByOccasion),
                followTrends: sp.followTrends,
                favoriteColors: sp.favoriteColors || [],
                avoidedColors: sp.avoidedColors || [],
                favoritePatterns: sp.favoritePatterns || []
            },
            sizePreference: {
                topSize: sp.topSize,
                bottomSize: sp.bottomSize,
                shoeSize: sp.shoeSize,
                fitPreference: sp.fitPreference,
                avoidedStyles: sp.avoidedStyles
            },
            shoppingHabits: {
                shoppingPlaces: sp.shoppingPlaces || [],
                frequency: sp.shoppingFrequency,
                shoppingMethod: sp.shoppingMethod,
                priorities: sp.priorities || []
            },
            interactionChannels: {
                platforms: sp.platforms || [],
                consentForAdvice: sp.consentForAdvice
            }
        };
    };

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto mt-10 p-6 text-center">
                <p>Loading your fashion preferences...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-4xl mx-auto mt-10 p-6 bg-red-50 rounded-lg">
                <p className="text-red-600">Error: {error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-4 bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {currentUser?.style_preferences ? (
                <FashionSurveyForm
                    initialData={getInitialFormData()}
                    onSubmit={handleSubmit}
                    isSubmitting={submitting}
                />
            ) : (
                <div className="text-center py-10">
                    <p>No style preferences found. Creating new profile...</p>
                    <FashionSurveyForm
                        onSubmit={handleSubmit}
                        isSubmitting={submitting}
                    />
                </div>
            )}
        </div>
    );
};

export default FashionSurveyPage;