import type { Statistics } from "../types/statistics";
import {ApiConstants} from "../constants/ApiConstants.ts";
import {getStoredUserId} from "./userStorageService.ts";




export async function getStatistics(): Promise<Statistics> {
    const userId = getStoredUserId();

    const response = await fetch(ApiConstants.STATISTICS_PATH, {


        method: "GET",
        headers: {
            [ApiConstants.USER_ID_HEADER]: userId,
        },
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Error cargando estadisticas");
    }

    return await response.json()as Statistics;
}

export function formatSeconds(segundos: number | null | undefined): string {
    if (segundos == null) return "--";

    const horas = Math.floor(segundos / 3600);
    const minutos = Math.floor((segundos % 3600) / 60);

    if (horas > 0 && minutos > 0) return `${horas} h ${minutos} min`;
    if (horas > 0) return `${horas} h`;
    return `${minutos} min`;
}
