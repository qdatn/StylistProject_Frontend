// hooks/useCrudApi.ts
import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
  UseMutationOptions,
} from "@tanstack/react-query";
import axiosClient from "@api/axiosClient";

type Params = Record<string, any>;
type Data = Record<string, any>;

// Fetch one item (GET)
export const useGetOne = <TData = unknown>(
  endpoint: string,
  queryKey?: string,
  params?: Record<string, any>,
  options?: UseQueryOptions<TData, Error>
) => {
  return useQuery<TData, Error>({
    queryKey: [queryKey, params], // Key is an array containing the endpoint and params
    queryFn: () => axiosClient.getOne<TData>(endpoint, params),
    ...options,
  });
};

// Fetch multiple items (GET)
export const useGetMany = <TData = unknown>(
  endpoint: string,
  queryKey: string,
  params: Record<string, any> = {},
  options?: UseQueryOptions<TData[], Error> // Expect an array of TData
) => {
  return useQuery<TData[], Error>({
    queryKey: [queryKey, params], // Key is an array of the endpoint and params
    queryFn: () => axiosClient.getMany<TData>(endpoint, params),
    ...options,
  });
};

// Create (POST) Hook
// export const useCreateData = <TData = unknown, TVariables = Data>(
//   endpoint: string,
//   queryKey: string,
//   data: TVariables,
//   options?: UseMutationOptions<TData, unknown, TVariables>
// ) => {
//   const queryClient = useQueryClient();

//   return useMutation<TData, unknown, TVariables>({
//     mutationKey: queryKey, // Using mutationKey instead of endpoint
//     mutationFn: (data:) => axiosClient.post(endpoint, data),
//     onSuccess: () => {
//       if (typeof queryKey === "string")
//         return queryClient.invalidateQueries({ queryKey: [role, queryKey] });
//       else {
//         const keysToInvalidate = queryKey ? [role, ...queryKey] : [role];
//         return queryClient.invalidateQueries({ queryKey: keysToInvalidate });
//       }
//     },
//     ...options,
//   });
// };

// // Update (PUT) Hook
// export const useUpdateData = <TData = unknown, TVariables = Data>(
//   endpoint: string,
//   options?: UseMutationOptions<TData, unknown, TVariables>
// ) => {
//   const queryClient = useQueryClient();

//   return useMutation<TData, unknown, TVariables>(
//     (data: TVariables) => axiosClient.put(endpoint, data),
//     {
//       ...options,
//       onSuccess: (data, variables, context) => {
//         queryClient.invalidateQueries(endpoint);
//         if (options?.onSuccess) options.onSuccess(data, variables, context);
//       },
//     }
//   );
// };

// // Delete (DELETE) Hook
// export const useDeleteData = <TData = unknown>(
//   endpoint: string,
//   options?: UseMutationOptions<TData, unknown, void>
// ) => {
//   const queryClient = useQueryClient();

//   return useMutation<TData, unknown, void>(() => axiosClient.delete(endpoint), {
//     ...options,
//     onSuccess: (data, variables, context) => {
//       queryClient.invalidateQueries(endpoint);
//       if (options?.onSuccess) options.onSuccess(data, variables, context);
//     },
//   });
// };
