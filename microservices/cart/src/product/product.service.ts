import { Observable } from 'rxjs';

export default interface ProductService {
  findAll({}): Observable<any>;
  findById(param: { id: string }): Observable<any>;
}
