import { fetchApi, ApiResponse } from './api';
import { Repository, RepositoryFormValues } from '../types';

/**
 * Repository submission interface
 */
export interface WarehouseSubmitRequest {
  address: string;
  type: string;
  branch: string;
  prompt: string;
  model: string;
  openAIKey: string;
  openAIEndpoint: string;
}

/**
 * Response structure for warehouse list
 */
export interface WarehouseListResponse {
  total: number;
  items: Repository[];
}

const API_URL = 'http://localhost:5085/api';

/**
 * Submit a new repository to the warehouse
 */
export async function submitWarehouse(
  data: RepositoryFormValues
): Promise<ApiResponse<Repository>> {
  return fetchApi<Repository>(API_URL + '/Warehouse/SubmitWarehouse', {
    method: 'POST',
    body: JSON.stringify(data),
  });
} 

/**
 * Get warehouse list
 */
export async function getWarehouse(page: number, pageSize: number): Promise<ApiResponse<WarehouseListResponse>> {
  return fetchApi<WarehouseListResponse>(API_URL + '/Warehouse/WarehouseList?page=' + page + '&pageSize=' + pageSize, {
    method: 'GET',
  });
}

export async function documentCatalog(organizationName:string,name:string):Promise<any>{
  return fetchApi<any>(API_URL + '/DocumentCatalog/DocumentCatalogs?organizationName=' + organizationName + '&name=' + name, {
    method: 'GET',
  });
}

export async function documentById(owner:string, name:string, path:string):Promise<any>{
  return fetchApi<any>(API_URL + '/DocumentCatalog/DocumentById?owner=' + owner + '&name=' + name + '&path=' + path, {
    method: 'GET',
  });
}

// /api/Warehouse/WarehouseOverview
export async function  getWarehouseOverview(owner:string, name:string){
  return fetchApi<any>(API_URL + '/Warehouse/WarehouseOverview?owner=' + owner + '&name=' + name , {
    method: 'GET',
  });
}

///api/Warehouse/LastWarehouse

export async function  getLastWarehouse(address:string){
  return fetchApi<any>(API_URL + '/Warehouse/LastWarehouse?address=' + address , {
    method: 'GET',
  });
}


