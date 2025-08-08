import axios, { AxiosInstance } from "axios"
import * as Device from "expo-device"

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
    config.headers["App-Platform"] = Device.brand ?? "web"
    config.headers.Scope = "membership"
    return config
  }
}

export const getAxiosInstance = (): AxiosInstance => {
  if (!instance) {
    throw new Error("membership-api has not been initialized yet")
  }
  return instance
}

export const useMembershipServiceHubInitialize = () => {
  const initialize = () => {
    axios.defaults.timeout = 30000
    instance = axios.create({
      baseURL: "https://your-magento-backend.com/rest/V1/membership", // Replace with your Magento URL
    })
    instance.interceptors.request.use(addAppVersionDetails())
  }

  const authorize = (token: string) => {
    instance.interceptors.request.use(addBearer(token))
  }

  return { initialize, authorize }
}
