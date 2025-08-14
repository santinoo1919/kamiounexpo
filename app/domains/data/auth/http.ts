import axios, { AxiosInstance } from "axios"
import Config from "@/config"

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
    config.headers.Scope = "auth"
    return config
  }
}

export const getAxiosInstance = (): AxiosInstance => {
  if (!instance) {
    throw "auth-api has not been initialized yet"
  }
  return instance
}

export const useAuthServiceHubInitialize = () => {
  const initialize = () => {
    axios.defaults.timeout = 30000
    instance = axios.create({
      baseURL: (Config as any).AUTH_API_URL ?? "https://api.example.com/auth",
    })
    instance.interceptors.request.use(addAppVersionDetails())
  }

  const authorize = (token: string) => {
    instance.interceptors.request.use(addBearer(token))
  }

  return { initialize, authorize }
}
