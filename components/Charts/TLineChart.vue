<script>
import { Line, mixins } from 'vue-chartjs'
const { reactiveProp } = mixins

export default {
  extends: Line,
  mixins: [reactiveProp],
  props: ['options'],
  data: () => ({
    selfOptions: {
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
              callback: function (label, index) {
                return `${new Intl.NumberFormat('ru-RU').format(Math.ceil(label))}₸`
              }
            },
            position: 'right',
            fontSize: 16,
          }],
        xAxes: [
          {
            display: true,
            barPercentage: 0.99,
            categoryPercentage: 0.99,
            fontSize: 16,
          }
        ],
      },
      legend: {
        display: true,
        labels: {
          fontSize: 14,
        }
      },
      elements: {
        bar: {
          borderRadius: 6,
        }
      },
      tooltips: {
        callbacks: {
          label: function (tooltipItem, data) {
            return `${data.datasets[tooltipItem.datasetIndex].label}: ${new Intl.NumberFormat('ru-RU').format(Math.ceil(tooltipItem.yLabel))}₸`
          }
        },
        bodyFontSize: 14
      },
      responsive: true,
      maintainAspectRatio: false
    }
  }),
  mounted () {
    this.renderChart(this.chartData, {...this.selfOptions, ...this.options});
  },
  watch: {
    chartData () {
      this.$data._chart.update()
    }
  }
}
</script>
