export interface Repository {
  id: string;
  name: string;
  address: string;
  type: string;
  prompt: string;
  model: string;
  openAIKey: string;
  openAIEndpoint: string;
  createdAt: string;
  updatedAt: string;
}

export interface RepositoryFormValues {
  address: string;
  type: string;
  prompt: string;
  model: string;
  openAIKey: string;
  openAIEndpoint: string;
} 