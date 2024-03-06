/* eslint-disable @typescript-eslint/no-explicit-any */
const STATUS = {
    SUCCESS: 'success',
    ERROR: 'error',
};

const STATUSCODE = {
    CREATED: 201,
    OK: 200,
    SERVER: 500,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
};

const successResponse = (status: string, data: any) => {
    return {
        status: status,
        data: data,
    };
};

const errorResponse = (status: string, data: any) => {
    return {
        status: status,
        error: data,
    };
};

export { STATUS, STATUSCODE, successResponse, errorResponse };
