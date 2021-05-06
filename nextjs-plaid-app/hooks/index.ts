import useSWR from "swr";

const fetcher =  (url) => fetch(url).then((res) => res.json());

export const useLinkToken = (callback: any) => {
    const { data, error } = useSWR(`/api/link/token`, fetcher, {onSuccess: (data) => callback(data)})

    return {
        linkTokenData: data,
        isLinkTokenLoading: !error && !data,
        isLinkTokenError: error
    }
}

export function useGetInstitutions () {
    const { data, error } = useSWR(`/api/institutions`, fetcher);

    return {
        institutionData: data,
        isGetInstitutionsLoading: !error && !data,
        isGetInstitutionsError: error
    }
}

export const useSandboxPublicToken = (linkToken: any) => {
    const { data, error } = useSWR(`/api/sandbox/public_token/create?linkToken=${linkToken}`, fetcher);

    return {
        sandboxPublicTokenData: data,
        sandboxPublicTokenLoading: !error && !data,
        sandboxPublicTokenError: error
    }
}

export const useExchangePublicToken = (publicToken: any) => {
    const { data, error } = useSWR(`/api/exchange/public_token?public_token=${publicToken}`, fetcher);

    return {
        exchangePublicTokenData: data,
        exchangePublicTokenLoading: !error && !data,
        exchangePublicTokenError: error
    }
}
