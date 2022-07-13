import React,{ useEffect, useState } from 'react';
import { ResponsivePie } from '@nivo/pie';


interface PieChartProps{
    graph: any;
}


// const Piechart = () => {
const Piechart = ({graph}:PieChartProps) => {
    const [ graphData, setGraphData ] = useState<any>({
        data: "",
        backgroundColor: ""
    })


    useEffect(() => {
        if(graph.data !== undefined) {
            const { data, backgroundColor } = graph
             setGraphData({
                ...graphData,
                data: data,
                backgroundColor: backgroundColor
             })
        }        
    },[graph.data,graph.backgroundColor])


    const chartData = [
        {
            "id": "내국인",
            "value": graphData.data[0],
            "color": graphData.backgroundColor[0],
        },
        {
            "id": "외국인",
            "value": graphData.data[1],
            "color": graphData.backgroundColor[1],
        },
    ]


    return (
        // chart height가 100%이기 때문이 chart를 덮는 마크업 요소에 height 설정
            <div style={{width: "124px", height: "124px"}}>
                <ResponsivePie
                    animate={false}
                    enableArcLabels={false}
                    enableArcLinkLabels={false}
                    colors={{ datum: 'data.color' }}
                    //  data 에 명시한 컬러를 사용할때 datum : data.color 로 설정시 데이터 안에 color 순서대로 출력 

                    /**
                     * chart에 사용될 데이터
                     */
                    data ={chartData}
                    /**
                     * chart margin
                     */
                    // margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                    /**
                     * chart 중간 빈공간 반지름
                     */
                    innerRadius={0.5}
                    /**
                     * pad 간격
                     */
                    padAngle={0}
                    /**
                     * pad radius 설정 (pad별 간격이 있을 시 보임)
                     */
                    cornerRadius={0}
                    /**
                     * chart 색상
                     */
                    /**
                     * pad border 두께 설정
                     */
                    // borderWidth={2}
                    /**
                     * link label skip할 기준 각도
                     */
                    // arcLinkLabelsSkipAngle={0}
                    /**
                     * link label 색상
                     */
                    // arcLinkLabelsTextColor="#000000"
                    /**
                     * link label 연결되는 선 두께
                     */
                    // arcLinkLabelsThickness={2}
                    /**
                     * link label 연결되는 선 색상
                     */
                    // arcLinkLabelsColor={{ from: 'color' }} // pad 색상에 따라감
                    /**
                     * label (pad에 표현되는 글씨) skip할 기준 각도
                     */
                    // arcLabelsSkipAngle={10}
                    // theme={{
                    //     /**
                    //      * label style (pad에 표현되는 글씨)
                    //      */
                    //     labels: {
                    //         text: {
                    //             fontSize: 14,
                    //             fill: '#000000',
                    //         },
                    //     },
                    //     /**
                    //      * legend style (default로 하단에 있는 색상별 key 표시)
                    //      */
                    //     legends: {
                    //         text: {
                    //             fontSize: 12,
                    //             fill: '#000000',
                    //         },
                    //     },
                    // }}
                    /**
                     * pad 클릭 이벤트
                     */
                    // onClick={handle.padClick}
                    /**
                     * legend 설정 (default로 하단에 있는 색상별 key 표시)
                     */
                    legends={[
                        {
                            anchor: 'bottom', // 위치
                            direction: 'row', // item 그려지는 방향
                            justify: false, // 글씨, 색상간 간격 justify 적용 여부
                            translateX: 0, // chart와 X 간격
                            translateY: 56, // chart와 Y 간격
                            itemsSpacing: 0, // item간 간격
                            itemWidth: 100, // item width
                            itemHeight: 18, // item height
                            itemDirection: 'left-to-right', // item 내부에 그려지는 방향
                            itemOpacity: 1, // item opacity
                            symbolSize: 18, // symbol (색상 표기) 크기
                            symbolShape: 'circle', // symbol (색상 표기) 모양
                        },
                    ]}
                />
            </div>
    );
};

export const MemoPiechart = React.memo(Piechart);
 