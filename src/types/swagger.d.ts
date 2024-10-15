// types/swagger.d.ts (create this file)
export interface OpenAPISpec {
  openapi: string; // The OpenAPI version (e.g., "3.0.0")
  info: {
    title: string;
    version: string;
    description?: string;
  };
  paths: {
    [path: string]: {
      [method: string]: {
        summary?: string;
        description?: string;
        responses: {
          [status: string]: {
            description: string;
          };
        };
        // Add other relevant fields based on your spec requirements
      };
    };
  };
}
