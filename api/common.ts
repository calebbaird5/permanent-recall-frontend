import axios from 'axios';
import  * as Querystring   from 'querystring'
import { useAuthStore } from '@/store/auth'
// const auth = useAuthStore();

export function encodeQueryString(options: ParsedQs) {
  let corrected: ParsedQs = {};
  for(let k in options) {
    let value = options[k];
    if(k == "include") k = "include[]";
    if(k == "columns") k = "columns[]";
    corrected[k] = value;
  }
  return Querystring.stringify(corrected);
}

function addHelperVars(item: any, index: number, arr: any[]) {
  item.editMode = false;
  item.showModal = false;
  item.selected = false;
  item.active = true;
  arr[index] = item;
}

interface ParsedQs {
  [key: string]: undefined | string | string[] | ParsedQs | ParsedQs[]
}

interface Response {
  data: any,
  message: string,
  headers: { [key: string]: undefined | string }
}

export class CommonAPI {
  basePath = '';
  apiPath = '/api/';
  fullResponse = false;
  totalRecords = 0;
  totalRecordPages = 0;

  constructor(basePath = '') {
    this.basePath = basePath;
  }

  list(
    params: ParsedQs = {},
    offset = 0,
    limit = 200,
    sort = 'updatedAt',
    include: string[] = []
  ) {
    params.offset = offset + '';
    params.limit = limit + '';
    params.sort = sort;
    params.include = include;
    return this._request('', 'get', params);
  }

  search(
    searchTerm: string,
    params: ParsedQs = {},
    offset = 0,
    limit = 200,
    sort = 'updatedAt',
    include: string[] = []
  ) {
    params.include = include;
    params.offset = offset + '';
    params.limit = limit + '';
    params.sort = sort;
    return this._request('search/' + searchTerm, 'get', params);
  }

  get(id: string,
      params: ParsedQs = {},
      include: string[] = [],
      offset = 0,
      limit = 200
     ) {
    params.include = include;
    params.offset = offset + '';
    params.limit = limit + '';
    return this._request(id, 'get', params, {});
  }

  update(id: string, data: any) {
    return this._request(id, 'put', {}, data);
  }

  create(data: any) {
    return this._request('', 'post', {}, data);
  }

  upsert(data: any) {
    if (data.id) return this.update(data.id, data);
    return this.create(data);
  }

  delete(id: string, force: boolean = false) {
    let params: ParsedQs = {};
    if (force) params.force = 'true';
    return this._request(id, 'delete', params, {});
  }


  async _request(
    endpoint = '',
    verb: 'get'|'post'|'put'|'delete',
    params: ParsedQs = {},
    body: any = null
  ) {
    let url = '';
    if (endpoint) {
      url = this.apiPath + this.basePath + '/' + endpoint;
    } else {
      url = this.apiPath + this.basePath;
    }

    // console.log('Network request. url: ' + url);

    if(process.env.baseUrl && process.env.baseUrl.length > 0){
      axios.defaults.baseURL = process.env.baseUrl;
      // console.log('Use baseUrl: ' + process.env.baseUrl);
    }else{
      // console.log('No baseUrl:');
    }

    // let authToken = auth.token || '';

    // if(authToken && authToken.length > 0) {
    //   axios.defaults.headers.common['Authorization'] = 'Bearer ' + authToken;
    //   // console.log('Use authToken: ' + authToken);
    // }else{
    //   // console.log('No authToken: ');
    // }


    let queryParams = encodeQueryString(params);
    if (queryParams) url += '?' + queryParams;

    try {
      let response: Response = await axios[verb](url, body)
      // console.log('CommonAPI. response. url: ' + url);
      // console.log(response);
      // console.log(response.data);
      this.totalRecords = parseInt(response?.headers['x-total'] || '');
      this.totalRecordPages = parseInt(response?.headers['x-total-pages'] || '');
      if(this.fullResponse) {
        return response.data;
      }else{
        return response.data.data;
      }
    } catch(err: any) {
      if (err?.response?.data?.errorMessage) {
        throw err.response.data.errorMessage
      }
      throw err;
    }
  }

  getBaseURL(
    id: string,
    params: ParsedQs = { offset: '', limit: '' },
    offset = 0,
    limit = 20,
    overridePath = ''
  ) {
    let baseUrl = this.apiPath;

    if (overridePath.length > 0) {
      baseUrl = baseUrl + overridePath;
    } else {
      baseUrl += this.basePath;
      if (id) baseUrl += '/' + id;
    }

    params.offset = offset + '';
    params.limit = limit + '';

    let queryParams = encodeQueryString(params);
    if (queryParams) baseUrl += '?' + queryParams;

    return baseUrl;
  }

  getBaseAPIConfig(authToken: string) {
    if (authToken && authToken.length > 0) {
      return {
        headers: this.getBaseHeaders(authToken),
        responseType: 'json',
      };
    } else {
      return {
        headers: this.getBaseHeadersNoAuth(),
        responseType: 'json',
      };
    }
  }

  getBaseFileAPIConfig(authToken: string) {
    return {
      headers: this.getBaseFileHeaders(authToken),
      responseType: 'json',
    };
  }
  getBaseHeadersNoAuth() {
    return {'api-auth': '12,34,644',};
  }

  getBaseHeaders(authToken: string) {
    return {
      'api-auth': '12,34,644',
      Authorization: 'Bearer ' + authToken,
      api_token: authToken,
    };
  }
  getBaseFileHeaders(authToken: string) {
    return {
      'api-auth': '12,34,644',
      Authorization: 'Bearer ' + authToken,
      api_token: authToken,
      'Content-Type': 'multipart/form-data',
      'content-type': 'multipart/form-data',
    };
  }
  getBaseAPIConfigWithTransform(authToken: string) {
    return {
      headers: this.getBaseHeaders(authToken),
      transformResponse: (res: any) => {
        res.forEach(addHelperVars);

        return res;
      },
      responseType: 'json',
    };
  }
}
