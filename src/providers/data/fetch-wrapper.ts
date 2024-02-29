import { GraphQLFormattedError} from 'graphql';

type Error = {
    message: string;
    statusCode: string;
}

const customFetch = async (url: string, options: RequestInit) => {
    const accessToken = localStorage.getItem("accessToken");

    const headers = options.headers as Record<string, string>;

    return await fetch(url, {
        ...options,
        headers: {
            ...headers,
            Authorization: headers?.Authorization || `Bearer ${accessToken}`,
            "Content-Type": "application/json",
            "Appolo-Require-Preflight": 'true',
        }
    })
}


const getGraphQLErrors = (body: Record<"errors", GraphQLFormattedError[] | undefined>) :
    Error | null => {
        if(!body) {
            return {
                message: "Unknown error",
                statusCode: "InternalServerError"
            }
        }

        if("errors" in body) {
            const errors = body?.errors;

            const messages = errors?.map((error) => error?.message)?.join("");
            const code = errors?.[0]?.extensions?.code;

            return {
                message: messages | JSON.stringify(errors),
                statusCode: code || 500;
            }
        }
}