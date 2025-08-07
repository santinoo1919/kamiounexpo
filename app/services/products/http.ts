import axios, { AxiosInstance } from "axios"

let instance: AxiosInstance

const addBearer = (accessToken: string) => {
  return (config: any) => {
    config.headers.Authorization = `Bearer ${accessToken}`
    return config
  }
}

const addAppVersionDetails = () => {
  return (config: any) => {
    config.headers["App-Version"] = "1.0.0"
    config.headers["App-Platform"] = "mobile"
    config.headers.Scope = "products"
    return config
  }
}

export const getAxiosInstance = (): AxiosInstance => {
  if (!instance) {
    throw "products-api has not been initialized yet"
  }
  return instance
}

export const useProductsHubInitialize = () => {
  const initialize = () => {
    axios.defaults.timeout = 30000
    instance = axios.create({
      baseURL: "https://api.example.com/products",
    })
    instance.interceptors.request.use(addAppVersionDetails())
  }

  const authorize = (token: string) => {
    instance.interceptors.request.use(addBearer(token))
  }

  return { initialize, authorize }
}
