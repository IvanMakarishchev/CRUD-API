import { Data } from 'app/interfaces/data';

export class DataService {
  private dataStorage: Array<Data> = [];

  addData(data: Data) {
    this.dataStorage.push(data);
  }
  changeData(id: string, data: Data) {
    const index = this.dataStorage.findIndex((user) => user.id === id);
    this.dataStorage[index] = { ...this.dataStorage[index], ...data };
  }
  getData() {
    return this.dataStorage;
  }
}
