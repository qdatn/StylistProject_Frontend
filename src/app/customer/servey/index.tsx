import { useState, useRef, useEffect } from 'react';
import { ImageUploader } from '@components/body_shape/ImageUploader';
import { NavigationBar } from '@components/body_shape/NavigationBar';
import { ShapeSection } from '@components/body_shape/ShapeSection';
import { BODY_SHAPES } from '@src/types/BodyType';
import FashionSurveyForm from '@components/FashionSurveyForm';

export default function FashionServeyPage() {
    return (
        <div>
            <FashionSurveyForm/>
        </div>
    )
}
