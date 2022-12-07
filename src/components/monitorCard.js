import config from '../../config.yaml'
import MonitorStatusLabel from './monitorStatusLabel'
import MonitorHistogram from './monitorHistogram'

const infoIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="h-5 mr-2 mx-auto text-blue-500 dark:text-blue-400"
  >
    <path
      fillRule="evenodd"
      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
      clipRule="evenodd"
    />
  </svg>
)

/*const alertIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" viewBox="0 0 20 19.33" width="20" height="19.33"><radialGradient id="a" gradientUnits="userSpaceOnUse" cy="393.79" cx="216.7" r="296.7"><stop stop-color="#F4D708" offset="0"/><stop
        stop-color="#FCB400" offset="1"/></radialGradient>
        <path
            d="m0.382 17.433 8.252 -16.464s1.179 -1.406 2.358 0c1.179 1.406 8.044 16.547 8.044 16.547s0.139 0.827 -1.248 0.827H1.63s-1.04 0 -1.248 -0.91z"
            fill="url(#a)"/>
        <path stroke="#E2A713" stroke-width="0.22321428571428573"
              d="m0.382 17.433 8.252 -16.464s1.179 -1.406 2.358 0c1.179 1.406 8.044 16.547 8.044 16.547s0.139 0.827 -1.248 0.827H1.63s-1.04 0 -1.248 -0.91z"
              fill="none"/>
        <path
            d="M9.487 13.064c-0.588 -3.57 -0.882 -5.496 -0.882 -5.779 0 -0.344 0.114 -0.622 0.342 -0.834 0.228 -0.212 0.485 -0.318 0.772 -0.318 0.31 0 0.572 0.113 0.786 0.339s0.321 0.492 0.321 0.798c0 0.292 -0.298 2.223 -0.893 5.793h-0.446zm1.205 1.704c0 0.272 -0.096 0.505 -0.289 0.697 -0.193 0.192 -0.422 0.289 -0.69 0.289 -0.272 0 -0.505 -0.096 -0.697 -0.289 -0.193 -0.193 -0.289 -0.425 -0.289 -0.697 0 -0.268 0.096 -0.497 0.289 -0.69s0.425 -0.289 0.697 -0.289c0.268 0 0.497 0.096 0.69 0.289s0.289 0.422 0.289 0.689z"/></svg>
)*/

export default function MonitorCard({ key, monitor, data }) {
  return (
    <div key={key} className="card">
      <div className="flex flex-row justify-between items-center mb-2">
        <div className="flex flex-row items-center align-center">
          {monitor.description && (
            <div className="tooltip">
              {infoIcon}
              <div className="content text-center transform -translate-y-1/2 top-1/2 ml-8 w-72 text-sm object-left">
                {monitor.description}
              </div>
            </div>
          )}
          {(monitor.linkable === true || monitor.linkable === undefined) ?
            (
              <a href={monitor.url} target="_blank">
                <div className="text-xl">{monitor.name}</div>
              </a>
            )
            :
            (
              <span>
                <div className="text-xl">{monitor.name}</div>
              </span>
            )
          }
        </div>
          {!monitor.lastCheck.operational && (
              <div className="tooltip">
                  {infoIcon}
                  <div className="content text-center transform -translate-y-1/2 top-1/2 ml-8 w-72 text-sm object-left">
                      {monitor.lastCheck.statusText}
                  </div>
              </div>
          )}
        <MonitorStatusLabel kvMonitor={data} />
      </div>
        <MonitorHistogram monitorId={monitor.id} kvMonitor={data}/>
      <div className="flex flex-row justify-between items-center text-gray-400 text-sm">
        <div>{config.settings.daysInHistogram} days ago</div>
        <div>Today</div>
      </div>
    </div>
  )
}
