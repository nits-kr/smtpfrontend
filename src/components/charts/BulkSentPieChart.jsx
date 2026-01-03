import React from "react";
import Chart from "react-apexcharts";

const BulkSentPieChart = () => {
  const series = [143760, 492, 5424, 5424, 5424, 5424, 5424, 5424];

  const options = {
    chart: {
      type: "donut",
      height: 380,
      toolbar: {
        show: true,
      },
    },

    title: {
      text: "Bulk Sent Analysis by SMTP",
      align: "center",
      style: {
        fontSize: "16px",
        fontWeight: 600,
      },
    },

    subtitle: {
      text: "Showing total Bulk Sent count per SMTP",
      align: "center",
      style: {
        fontSize: "12px",
        color: "#64748b",
      },
    },

    labels: [
      "smtp2",
      "elastic001",
      "smtp005",
      "smtp006",
      "smtp007",
      "smtp008",
      "smtp009",
      "smtp010",
    ],

    legend: {
      position: "right",
      fontSize: "12px",
    },

    dataLabels: {
      enabled: true,
      formatter: (val, opts) =>
        `${opts.w.globals.labels[opts.seriesIndex]}: ${
          opts.w.globals.series[opts.seriesIndex]
        }`,
      style: {
        fontSize: "11px",
      },
      dropShadow: {
        enabled: true,
      },
    },

    plotOptions: {
      pie: {
        donut: {
          size: "55%",
        },
        expandOnClick: true,
      },
    },

    tooltip: {
      y: {
        formatter: (val) => `Bulk Sent: ${val.toLocaleString()}`,
      },
    },

    stroke: {
      width: 1,
    },

    colors: [
      "#ff6b2c",
      "#22c55e",
      "#38bdf8",
      "#a855f7",
      "#14b8a6",
      "#facc15",
      "#fb7185",
      "#6366f1",
    ],
  };

  return (
    <div className="w-full bg-white rounded-lg p-4 shadow">
      <Chart options={options} series={series} type="donut" height={380} />
    </div>
  );
};

export default BulkSentPieChart;
