import React,{useEffect} from 'react';
import { Chart } from 'chart.js';
import ChartDataLabels from "chartjs-plugin-datalabels";
import * as Utils from "../../constants/utils";

interface AmountGraphChartProps {
    graph: any;
}


let lineChart: any = null;
const AmountGraphChart = ({graph}:AmountGraphChartProps) => {


    //##################################################################################################################
    //##
    //## >> Method : Override
    //##
    //##################################################################################################################

    useEffect(()=> {
        // 새로운 차트를 그리기 위해서 차트가 새로 그려질때마자 기존 차트가 있으면 삭제 함
        if (lineChart != null) {
            lineChart.destroy();
        }
        // 플러그인을 전역으로 등록해서 모든 차트에 적용 가능
        // ChartDataLabels 플러그인
        Chart.plugins.register(ChartDataLabels);

        // 그래프에 들어올 데이터의 갯수만큼 배열 할당
        let data = [0, 0, 0, 0, 0, 0];
        if (!Utils.isEmpty(graph)) {
            data = [graph.m3_count1, graph.m3_count2, graph.m3_count3, graph.m3_count4, graph.m3_count5, graph.m3_count6];
            //그래프 수치에서 가장 높은 수를 구함
            let max = Math.max(...data);
            // 가장 높은 수가 0보다 클 경우에 반복문
            // 데이터의 length 만큼 반복 하는데 해당 데이터를 100분율로 나타냄
            if (max > 0) {
                for (let i = 0; i < data.length; i++) {
                    data[i] = data[i] / max * 100;
                }
            }
        }
        // 그래프가 렌더링될 캔버스 (id로 해당 돔을 가져옴)
        let canvas: any = document.getElementById("lineChart");
        // 2d 로 그림
        let mCtx = canvas.getContext("2d");
        lineChart = new Chart(mCtx, {
            // 챠트형태
            type: "line",
            data: {
                labels: data,
                datasets: [{
                    //x축 label에 대응되는 데이터 값
                    data: data,
                    borderColor: "#e1e1e1",
                    backgroundColor: "#f1f1f1",
                    fill: true,
                    lineTension: 0,
                    pointRadius: 0
                }]
            },
            options: {
                responsive: true,
                legend: {
                    display: false
                },
                scales: {
                    xAxes: [{
                        display: false,
                    }],
                    yAxes: [{
                        display: false,
                    }]
                },
                tooltips: {
                    enabled: false
                },
                animation: {
                    duration: 0
                },
                plugins: {
                    datalabels: {
                        formatter: function() {
                            return "";
                        }
                    },

                }
            }
        });
        lineChart.update();
    },[graph]);




    return (
        <>
            <canvas id="lineChart" />
        </>
    )
}

export default AmountGraphChart;