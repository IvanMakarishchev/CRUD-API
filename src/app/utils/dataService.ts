import { Data } from "app/interfaces/data";

export class DataService {
  private dataStorage: Array<Data> = [];

  addData(data: Data) {
    this.dataStorage.push(data);
  }
  getData() {
    return this.dataStorage;
  }
  
}