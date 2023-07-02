import { Data } from 'app/interfaces/data';

export class DataService {
  private dataStorage: Array<Data> = [];

  addData(data: Data) {
    this.dataStorage.push(data);
  }
  changeData(index: number, data: Data) {
    this.dataStorage[index] = { ...this.dataStorage[index], ...data };
  }
  removeData(index: number) {
    this.dataStorage.splice(index, 1);
  }
  getData() {
    return this.dataStorage;
  }
}
