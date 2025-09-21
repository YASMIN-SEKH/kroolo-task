type ActivityItemProps = {
  time: string
  activity: string
  person: {
    name: string
    imageUrl?: string
  }
}

export default function ActivityFeed({ items }: { items: ActivityItemProps[] }) {
  return (
    <div className="flow-root">
      <ul role="list" className="-mb-8">
        {items.map((item, itemIdx) => (
          <li key={itemIdx}>
            <div className="relative pb-8">
              {itemIdx !== items.length - 1 ? (
                <span className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
              ) : null}
              <div className="relative flex space-x-3">
                <div>
                  {item.person.imageUrl ? (
                    <img
                      className="h-8 w-8 rounded-full bg-gray-400 flex items-center justify-center ring-8 ring-white"
                      src={item.person.imageUrl}
                      alt=""
                    />
                  ) : (
                    <span className="h-8 w-8 rounded-full bg-gray-400 flex items-center justify-center ring-8 ring-white">
                      <span className="text-sm font-medium leading-none text-white">
                        {item.person.name[0]}
                      </span>
                    </span>
                  )}
                </div>
                <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                  <div>
                    <p className="text-sm text-gray-500">
                      <span className="font-medium text-gray-900">{item.person.name}</span> {item.activity}
                    </p>
                  </div>
                  <div className="whitespace-nowrap text-right text-sm text-gray-500">
                    {item.time}
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}