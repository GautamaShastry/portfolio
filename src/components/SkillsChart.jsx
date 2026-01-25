import { motion } from 'framer-motion'
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

const skillsData = [
    { skill: 'Frontend', level: 90, fullMark: 100 },
    { skill: 'Backend', level: 85, fullMark: 100 },
    { skill: 'AI/ML', level: 88, fullMark: 100 },
    { skill: 'DevOps', level: 80, fullMark: 100 },
    { skill: 'Databases', level: 85, fullMark: 100 },
    { skill: 'Cloud', level: 82, fullMark: 100 },
]

const detailedSkills = [
    { name: 'React', level: 92 },
    { name: 'Python', level: 90 },
    { name: 'LangChain', level: 88 },
    { name: 'Spring Boot', level: 85 },
    { name: 'Node.js', level: 87 },
    { name: 'AWS', level: 82 },
    { name: 'Docker', level: 85 },
    { name: 'PostgreSQL', level: 83 },
]

const SkillsChart = () => {
    const [chartType, setChartType] = useState('radar')
    const { t } = useTranslation()

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-16 p-6 bg-white dark:bg-neutral-800/50 rounded-2xl border border-gray-100 dark:border-neutral-700"
        >
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {t('skills.proficiency')}
                </h3>
                <div className="flex gap-2">
                    <button
                        onClick={() => setChartType('radar')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            chartType === 'radar'
                                ? 'bg-purple-500 text-white'
                                : 'bg-gray-100 dark:bg-neutral-700 text-gray-700 dark:text-gray-300 hover:bg-purple-500/10'
                        }`}
                    >
                        Radar
                    </button>
                    <button
                        onClick={() => setChartType('bar')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            chartType === 'bar'
                                ? 'bg-purple-500 text-white'
                                : 'bg-gray-100 dark:bg-neutral-700 text-gray-700 dark:text-gray-300 hover:bg-purple-500/10'
                        }`}
                    >
                        Bar
                    </button>
                </div>
            </div>

            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    {chartType === 'radar' ? (
                        <RadarChart data={skillsData}>
                            <PolarGrid stroke="#6b7280" />
                            <PolarAngleAxis 
                                dataKey="skill" 
                                tick={{ fill: '#9ca3af', fontSize: 12 }}
                            />
                            <PolarRadiusAxis 
                                angle={30} 
                                domain={[0, 100]} 
                                tick={{ fill: '#9ca3af', fontSize: 10 }}
                            />
                            <Radar
                                name="Skills"
                                dataKey="level"
                                stroke="#a855f7"
                                fill="#a855f7"
                                fillOpacity={0.4}
                            />
                        </RadarChart>
                    ) : (
                        <BarChart data={detailedSkills} layout="vertical">
                            <XAxis type="number" domain={[0, 100]} tick={{ fill: '#9ca3af' }} />
                            <YAxis 
                                dataKey="name" 
                                type="category" 
                                tick={{ fill: '#9ca3af', fontSize: 12 }}
                                width={80}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1f2937',
                                    border: 'none',
                                    borderRadius: '8px',
                                    color: '#fff'
                                }}
                            />
                            <Bar 
                                dataKey="level" 
                                fill="#a855f7" 
                                radius={[0, 4, 4, 0]}
                                background={{ fill: '#374151', radius: [0, 4, 4, 0] }}
                            />
                        </BarChart>
                    )}
                </ResponsiveContainer>
            </div>
        </motion.div>
    )
}

export default SkillsChart
