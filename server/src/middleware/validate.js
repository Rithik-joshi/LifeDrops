import { fail } from '../utils/response.js';
export const validate=(schema,source='body')=>(req,res,next)=>{const result=schema.safeParse(req[source]);if(!result.success)return fail(res,'Validation failed',422,result.error.issues.map(i=>({path:i.path.join('.'),message:i.message})));req[source]=result.data;next();};
