
import React from 'react';
import styles from '../../app/dashboard/Dashboard.module.scss';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    ChartOptions,
    BarController
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels'; 



ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    BarController,
    ChartDataLabels 
);


ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    BarController,
    ChartDataLabels 
);
import  useDashboardStore  from '../../stores/useDashboardStore';

const Insights: React.FC = () => {
    const { insightsData } = useDashboardStore((state) => ({
      insightsData: state.insightsData,
    }));

    const appDownloadsData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
            {
                data: [500, 1000, 1500, 2000, 3000, 4000, 3500, 2500, 2000, 1500, 1000, 500],
                backgroundColor: '#0045E6',
                borderColor: '#0045E6',
                borderWidth: 2,
                borderRadius: 5,
                barThickness: 20,
            },
        ],
    };

    const jobsData = {
        datasets: [
            {
                data: [5263, 12415], 
                backgroundColor: ['#37cc61', '#c8c5f5'],
                hoverBackgroundColor: ['#2fab53', '#b5b3f0'],
                borderWidth: 2,
            },
        ],
        labels: ['Jobs Applied', 'Jobs Posted'], 
    };

    const sitePerformanceData = {
        labels: ['No of visits', 'No. of Registrations', 'Work videos uploaded', 'CVs uploaded'],
        datasets: [
            {
                data: [12384, 7283, 1456, 4910],
                backgroundColor: '#0045E6',
                borderColor: '#0045E6',
                borderWidth: 2,
                borderRadius: 5,
                barThickness: 12,
            },
        ],
    };

    const barChartOptions: ChartOptions<'bar'> = {
        plugins: {
            legend: {
                display: false, 
            },
            datalabels: {
                display: false, 
            }
        },
        scales: {
            x: {
                grid: {
                    display: false, 
                },
                ticks: {
                    color: '#000', 
                    padding: 10,
                },
                border: {
                    color: '#D3C6E6', 
                    width: 1, 
                }
            },
            y: {
                min: 0, 
                max: 4000, 
                ticks: {
                    stepSize: 1000, 
                    callback: function(tickValue: string | number) {
                        
                        if (typeof tickValue === 'number') {
                            return [1000, 2000, 3000, 4000].includes(tickValue) ? tickValue : '';
                        }
                        return '';
                    }
                },
                grid: {
                    display: true, 
                },
                border: {
                    display: false, 
                },
            },
        },
        responsive: true,
        maintainAspectRatio: false, 
    };

    const barChartOptionsHorizontal: ChartOptions<'bar'> = {
        indexAxis: 'y', 
        plugins: {
            legend: {
                display: false, 
            },
            datalabels: {
                display: true,
                anchor: 'end',
                align: 'right',
                formatter: (value: number) => value,
                color: '#000',
                font: {
                    size: 12
                }
            }
        },
        scales: {
            x: {
                beginAtZero: true, 
                grid: {
                    display: false, 
                },
                ticks: {
                    display: false,
                },
                border: {
                    display: false,
                }
            },
            y: {
                grid: {
                    display: false,
                },
                ticks: {
                    display: true, 
                },
                border: {
                    color: '#d2b0ff', 
                },
            },
        },
    };

    const doughnutOptions = {
        plugins: {
            legend: {
                display: false,
            },
            datalabels: {
                display: false, 
            }
        },
        cutout: '80%', 
    };

    return (
        <div className={styles.insights}>
                   <div className={`${styles.insightCard} ${styles.largeCard} ${styles.appDownloadsCard}`}>
                <div className={styles.cardHeader}>
                    <h2>App downloads</h2>
                    <div className={styles.dropdown}>
                        <span>This Year</span>
                        <i className="fas fa-chevron-down"></i>
                    </div>
                </div>
                <div className={styles.graphContainer}>
                    <Bar data={appDownloadsData} options={barChartOptions} /> 
                </div>
            </div>

          
            <div className={`${styles.insightCard} ${styles.smallCard}`}>
                <div className={styles.cardHeader}>
                    <h2>Jobs</h2>
                    <div className={styles.dropdown}>
                        <span>This Month</span>
                        <i className="fas fa-chevron-down"></i>
                    </div>
                </div>
                <div className={styles.graphContainer}>
                <Doughnut data={jobsData} options={doughnutOptions} />
                </div>
                <div className={styles.chartLabels}>
                    <span><span className={styles.posted}></span> Jobs Posted</span>
                    <span><span className={styles.applied}></span> Jobs Applied</span>
                </div>
                <div className={styles.totalLabel}>
  <div className={styles.totalValue}>12,415</div>
  <div className={styles.totalText}>Total</div>
</div>

            </div>

           
            <div className={`${styles.insightCard} ${styles.smallCard}`}>
                <div className={styles.cardHeader}>
                    <h2>Site Performance</h2>
                    <div className={styles.dropdown}>
                        <span>This Month</span>
                        <i className="fas fa-chevron-down"></i>
                    </div>
                </div>
                <div className={styles.graphContainer}>
                    <Bar data={sitePerformanceData} options={barChartOptionsHorizontal} />
                </div>
            </div>
        </div>
    );
};

export default Insights;
