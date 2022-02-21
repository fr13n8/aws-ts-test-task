interface ResponseGenerator {
    statusCode: number;
    body: string;
    headers?: {
        [key: string]: string;
    };
}

export class ResponseBuilder {

	public build(statusCode: number , message: string, data: { [key: string]: any }): ResponseGenerator {
		return ResponseBuilder.createResponse({
			statusCode: statusCode,
			body: JSON.stringify({
				message,
				...data && {
					data
				}
			}
			)});
	}

	private static createResponse(response: ResponseGenerator): ResponseGenerator {
		return {
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Content-Type': 'application/json'
			},
			...response
		};
	}

}
