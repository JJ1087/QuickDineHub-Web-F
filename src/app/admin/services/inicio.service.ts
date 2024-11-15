import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Feedback {
    _id: string;
    respuestaUno: number;
    respuestaDos: number;
    respuestaTres: number;
  }

@Injectable({
  providedIn: 'root',
})
export class InicioService {
    private apiUrl = 'https://quickdinehub-back1.onrender.com'; //URL de API

  constructor(private http: HttpClient) {}

  // Método para obtener la información de los productos
  obtenerFeedbacks(): Observable<Feedback[]> {
    return this.http.get<Feedback[]>(`${this.apiUrl}/info-feedback`);
  }
}