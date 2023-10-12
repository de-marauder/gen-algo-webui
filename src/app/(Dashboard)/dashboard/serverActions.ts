'use server'

import { TypeConfig } from "@/Types/Config";
import { APIConfig } from "./config/_helper";
import axios from "axios";
import { TypeRun } from "@/Types/Run";

export const getRunsWithConfig = async (configs: TypeConfig[], apiConfig: typeof APIConfig): Promise<{ data: [string, number][] | null, error: Error | null }> => {
  'use server'
  const dataList: [string, number][] = []
  try {
    let data: TypeRun[] | null = null
    for (const config of configs) {
      const allRunsUrl = `${process.env.NEXT_PUBLIC_API_URL}/runs?configId=${config._id}`;
      data = await axios.get<{ data: TypeRun[] }>(allRunsUrl, apiConfig)
        .then(({ data }) => {
          // // console.log(data)
          return data.data
        });
      // console.log('data on server config = ', config.name)
      // console.log('data on server = ', data)
      dataList.push([config.name, data?.length || 0]);
    }
    return { data: dataList, error: null };
  } catch (error) {
    // console.log("Error getting runds from config Id: \n", error)
    return { data: null, error: error as Error }
  }
}