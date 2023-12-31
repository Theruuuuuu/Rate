import { Component, OnInit } from '@angular/core';
import { Chart} from 'chart.js/auto';
import { SqlService } from '../services/sql.service';
import { info } from '../model/model';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit{
  title:string='-'

  //比較公司項目
  companies:string[]=[]

  //#region navbar參數
  company:info[] = []
  filtered:info[] = []
  private debounceTimeout: any;
  //#endregion


  //#region SideBar參數


  navLabel:string[]=['負債佔資產比率(%)','長期資金佔不動產、廠房及設備比率(%)','流動比率(%)','速動比率(%)','利息保障倍數(%)','應收款項週轉率(次)','平均收現日數','存貨週轉率(次)','平均銷貨日數','不動產、廠房及設備週轉率(次)','總資產週轉率(次)','資產報酬率(%)','權益報酬率(%)','稅前純益佔實收資本比率(%)','純益率(%)','每股盈餘(元)','現金流量比率(%)','現金流量允當比率(%)','現金再投資比率(%)']
  //#endregion





  //#region 測試參數
  Ticker:string = '1101'
  Name:string = '台泥'
  Years:number[] = [106, 107, 108, 109, 110, 111]
  v106:any[] = []
  v107:any[] = []
  v108:any[] = []
  v109:any[] = []
  v110:any[] = []
  v111:any[] = []
  //#endregion

  //#region 主要資料
  apiData:any[] = []
  //#endregion

  //#region 圖表
  myChart:any
  rate:any[][] =[]

  //#region 表格
  tablerate:any[]=[]
  tablecompany:string[]=[]
  //#endregion

  // 當前的比率
  companyData:any
  //#endregion

  constructor(private sql:SqlService){
  }
  ngOnInit(): void {
    this.chartCreate(0)
    
  }

  //選擇比率
  chartCreate(index:number){
    
    const label = this.navLabel[index]
    this.rate = []
    this.tablerate = []

    for(let i= 0; i< this.v106.length; i++){
      const r = []
      const i106 = this.v106[i]
      r.push(i106[index])
      const i107 = this.v107[i]
      r.push(i107[index])
      const i108 = this.v108[i]
      r.push(i108[index])
      const i109 = this.v109[i]
      r.push(i109[index])
      const i110 = this.v110[i]
      r.push(i110[index])
      const i111 = this.v111[i]
      r.push(i111[index])
      this.rate.push(r)

      //表格 包含公司名稱
      const r1 = r.slice()
      r1.unshift(this.companies[i])
      this.tablerate.push(r1)
    }

    this.tablecompany = this.companies.slice()

    if(this.v106.length>=2){
      const avg: any[] = []

      for(let i= 0; i< 6; i++){
        let sum = 0
        for(let j= 0; j< this.rate.length; j++){
          sum += Number(this.rate[j][i])
        }

        //取小數點第二位
        avg.push((sum/this.rate.length).toFixed(2))

      }
      this.rate.push(avg)
      
      const temparray = avg.slice()
      temparray.unshift('平均')
      this.tablerate.push(temparray)

      //修正圖例名稱
      
      this.tablecompany.push('平均')
    }

    //比率名稱
    this.title = label

    const config:any = {
      type: 'line',
      data: this.chartConfig(this.tablecompany, this.rate),
      options: {
        scales: {
          x:{
            ticks:{
              font:{
                size:25
              }
            }
          },
          y:{
            ticks:{
              font:{
                size:25
              }
            }
          }
        },
        plugins: {
            legend: {
                labels: {
                    // This more specific font property overrides the global property
                    font: {
                        size: 25
                    }
                }
            }
        }
             
      }
    };

    //刪掉重建
    var chart = Chart.getChart('LineChart')
    if(chart){
      chart.destroy()
    }

    this.myChart = new Chart('LineChart', config)
  }


  chartConfig(label:string[], ratedata:number[][]){
    const labels = this.Years

    this.companyData = []
    for(let i=0; i<ratedata.length; i++){
      this.companyData.push({
        label: label[i],
        data: ratedata[i],
        fill: false,
        // borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      })
    }

    const data = {
      labels: labels,
      datasets: this.companyData,
      
    }
    return data
  }

  //#region nav方法
  onSearchInput(event: any): void {
    // 清除上一次的定时器
    clearTimeout(this.debounceTimeout);

    // 创建新的定时器，设置防抖时间间隔为 300 毫秒
    this.debounceTimeout = setTimeout(() => {
      const searchTerm = event;
      this.search(searchTerm);
    }, 1000);
  }


  search(value:string){
    this.sql.jsonget().subscribe(
      u=>{
        this.company = u
        this.filtered  = this.company.filter((info)=>info.Ticker.toString().includes(value) || info.Name.includes(value))
        this.filtered = this.filtered.slice(0, 5)
      }
    )
  }

  addItem(item:info, input:HTMLInputElement){
    if(this.companies.includes(item.Ticker+item.Name)){return}
    this.sql.getrate(item.Ticker.toString()).subscribe(
      u=>{
        const value = u
        this.v106.push(value[0])
        this.v107.push(value[1])
        this.v108.push(value[2])
        this.v109.push(value[3])
        this.v110.push(value[4])
        this.v111.push(value[5])
        
        this.companies.push(item.Ticker+item.Name)
        
        this.chartCreate(0)

        this.filtered = []

        input.value = ''
      }
    )
    
  }

  delItem(item:string){
    const index = this.companies.indexOf(item)
    this.companies.splice(index,1)
    this.v106.splice(index,1)
    this.v107.splice(index,1)
    this.v108.splice(index,1)
    this.v109.splice(index,1)
    this.v110.splice(index,1)
    this.v111.splice(index,1)
    this.chartCreate(0)
  }
  //#endregion



}
