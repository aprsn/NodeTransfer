import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

constructor(private http: HttpClient) { }

baseURL = environment.baseURL;
token = localStorage.getItem('token');

getUserInfo(uniqId) {
  return this.http.get(this.baseURL + '/get/userInfo/' + uniqId);
}
listUserFiles(uniqId) {
  return this.http.get(this.baseURL + '/get/listUploads/' + uniqId);
}

uploadFile(file) {
  return this.http.post(this.baseURL + '/post/upload', '{"file": ' + file + '}');
}
deleteFile(uniqId, file) {
  const model = {unique_id: uniqId, filename: file};
  return this.http.post(this.baseURL + '/post/deleteFile', model);
}
downloadFile(uniqId, filename) {
  return this.http.get(this.baseURL + `/get/userFile/${uniqId}/${filename}`, { responseType: 'blob' });
}

searchUser(q) {
  return this.http.get(this.baseURL + '/get/listUsers/' + q);
}

setPrivacy(uniqId, priv) {
  const model = {unique_id : uniqId, privacy: priv };
  return this.http.post(this.baseURL + '/post/setPrivacy', model);
}
setFilePrivacy(uniqId, priv, file) {
  const model = {unique_id: uniqId, privacy: priv, filename: file};
  return this.http.post(this.baseURL + '/post/setFilePrivacy', model);
}

postFile(fileToUpload: File): Observable<boolean> {
  const formData: FormData = new FormData();
  formData.append('file', fileToUpload, fileToUpload.name);
  return this.http
    .post(this.baseURL + '/post/upload', formData).pipe(map(() => true ));

}
getFiles(username) {
  return this.http.get(this.baseURL + '/get/userFiles/' + username );
}

}
