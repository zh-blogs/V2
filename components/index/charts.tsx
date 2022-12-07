import React from 'react';
import { Card, Loading } from '@/components/antd';

import { Flex } from '@/components/flex';
import ReactECharts, { EChartsReactProps } from 'echarts-for-react';
import { getArchCharts, getDomainCharts } from '@/utils/api';
import { Context, showNotification, Combine } from '@/utils';

const charts = [
  { name:"架构统计图", chart: <ArchChart/> },
  { name:"顶级域名统计图", chart: <DomainChart/> },
];

const RCharts = (props:EChartsReactProps&{loading:boolean}) => {
  const { loading, style, ...restProps } = props;
  const ref = React.useRef<ReactECharts>();

  const ctx = React.useContext(Context);
  const { width } = ctx;
  React.useEffect(() => {
    // echarts 监听窗口大小变化触发先于首页触发，会导致 echarts 认为的宽度大于实际宽度
    // 在上下文宽度变化时，手动触发 echarts 读取宽度
    if (!!ref && !!ref.current) {
      const r = ref.current.getEchartsInstance();
      r.resize();
    } 
  }, [width]);

  return <Loading loading={loading}>
    <ReactECharts
      ref={(e) => {
        if (!!e) {
          ref.current = e;
        }
      }}
      style={{
        width:"100%",
        height:500,
        ...style
      }}
      {...restProps} />
  </Loading>;
};

function separateInnerAndOuterPie(data:{name:string, count:number}[], n:number= 15){
  const sum = data.reduce((pre, cur) => pre + cur.count, 0);
  const trnasfer = (item: { name: string, count: number }) => ({
    ...item,
    name: item.name,
    value: item.count,
    percent: parseInt(`${item.count / sum * 10000}`) / 100,
  });
  if (data.length > n) {
    return [
      data.slice(0, n).map(trnasfer),
      data.slice(n).map(trnasfer),
    ];
  } 
    
  return [
    data.map(trnasfer),
    [],
  ];
};

function InnerOuterPie(props: Combine<Partial<EChartsReactProps>, {
  title: string,
  loading: boolean,
  data: { name: string, count: number }[],
  n?: number
}>) {
  const { data, option, title, n=15, ...restProps } = props;
  const [level1, level2] = React.useMemo(() => {
    return separateInnerAndOuterPie(data, n);
  }, [data, n]);

  return <RCharts
    option={{
      title: { text: title, left: 'center' }, 
      legend: { type: 'scroll', right: '5%', top: 'center', orient: 'vertical', },
      tooltip: {
        trigger: 'item',
        formatter: (item: any) => `${item.marker} <b>${item.name}</b>
        <br/>
        共 ${item.data.value} 个站点，占 ${item.data.percent}%`
      },
      series: [
        {
          type: "pie",
          data: level1,
          radius:[0, "30%"],
          label: {
            position: 'outer',
            alignTo: 'edge',
          },
        },
        {
          type: "pie",
          data: level2,
          radius: ["40%", "50%"], 
          label: {
            position: 'outer',
            alignTo: 'edge',
          },
        }
      ],
      ...option,
    }}
    {...restProps}
  />;
}

function ArchChart() {
  const [data, setData] = React.useState<{
    name: string,
    count: number,
    description?: string,
    url?:string,
  }[]>([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    setLoading(true);
    getArchCharts({}).then((result) => {
      if (showNotification(result) && !!result.data) {
        const arr = result.data;
        arr.sort((a, b) => b.count - a.count);
        setData(arr);
      }
    })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  

  const onClick = React.useCallback((e: any) => {
    if (!!e && !!e.data && !!e.data.url) {
      window.open(e.data.url);
    }
  }, []);
  const evs = React.useMemo(() => ({
    'click': onClick,
  }), [onClick]);

 

  return <InnerOuterPie
    loading={loading}
    onEvents = {evs}
    title="架构统计图"
    data={data}
    n={7}
    option={{
      tooltip: {
        trigger: 'item',
        formatter: (item: any) => `<div style="max-width:15em; white-space: normal; word-break: break-all;">
        ${item.marker} <b>${item.name}</b>
        <br/>
        共 ${item.data.value} 个站点，占 ${item.data.percent}%
        ${item.data.description ? `<br/><br/>${item.data.description}` : ""}
        ${item.data.url ? `<br/><br/><em>点击可跳转至主页</em>` : ""}
        </div>`
        
      },
    }}
  />;
}


function DomainChart() {
  const [data, setData] = React.useState<{
    name: string,
    count: number,
  }[]>([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    setLoading(true);
    getDomainCharts({}).then((result) => {
      if (showNotification(result) && !!result.data) {
        const arr = result.data;
        arr.sort((a, b) => b.count - a.count);
        setData(arr);
      }
    })
      .finally(() => {
        setLoading(false);
      });
  }, []);

 
  return <InnerOuterPie
    loading={loading}
    data={data}
    title="域名统计图"
  />;
}


export function Charts() {
  return <Flex direction="TB" mainAxis="space-around" fullWidth>
    {charts.map((item) =>
      <Card key={item.name} style={{ background: "#fcfcfc" }}>{item.chart}</Card>
    )}
  </Flex>;
}