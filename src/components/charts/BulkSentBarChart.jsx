import React from "react";
import Chart from "react-apexcharts";

const BulkSentBarChart = () => {
  const series = [
    {
      name: "Bulk Sent",
      data: [
        4000, 3000, 2000, 2780, 1890, 2390, 3490, 5424, 5424, 5424, 5424,
        143760,
      ],
    },
  ];

  const options = {
    chart: {
      type: "bar",
      height: 380,
      toolbar: {
        show: true, // ≡ menu like screenshot
      },
    },

    title: {
      text: "Bulk Sent by SMTP (Cylinder)",
      align: "center",
      style: {
        fontSize: "16px",
        fontWeight: 600,
      },
    },

    xaxis: {
      categories: [
        "smtp001",
        "smtp002",
        "smtp003",
        "smtp004",
        "smtp005",
        "smtp006",
        "smtp007",
        "smtp008",
        "smtp009",
        "smtp010",
        "smtp011",
        "smtp2",
      ],
      labels: {
        rotate: -45,
        style: {
          fontSize: "11px",
        },
      },
    },

    yaxis: {
      title: {
        text: "Bulk Sent",
      },
      labels: {
        formatter: (val) => `${val / 1000}k`,
      },
    },

    plotOptions: {
      bar: {
        columnWidth: "45%",
        borderRadius: 10, // cylinder feel
        distributed: false,
      },
    },

    fill: {
      type: "gradient",
      gradient: {
        shade: "light",
        type: "vertical",
        shadeIntensity: 0.5,
        gradientToColors: ["#38bdf8"],
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100],
      },
    },

    dataLabels: {
      enabled: false,
    },

    tooltip: {
      y: {
        formatter: (val) => `Bulk Sent: ${val.toLocaleString()}`,
      },
    },

    legend: {
      show: true,
      position: "bottom",
    },

    grid: {
      strokeDashArray: 3,
    },

    colors: ["#0ea5e9"],

    states: {
      hover: {
        filter: {
          type: "lighten",
          value: 0.15,
        },
      },
    },
  };

  return (
    <div className="w-full bg-white rounded-lg p-4 shadow">
      <Chart options={options} series={series} type="bar" height={380} />
    </div>
  );
};

export default BulkSentBarChart;
