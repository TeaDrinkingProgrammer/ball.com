import {
	Injectable,
	NestInterceptor,
	ExecutionContext,
	CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import {parse, stringify} from "json-bigint";

//From https://github.com/expressjs/express/issues/4453. Fixes the issue of bigint to JSON not being implemented
@Injectable()
export class BigintInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		return next.handle().pipe(
			map((data) => {
				return parse(stringify(data));
			}),
		);
	}
}

