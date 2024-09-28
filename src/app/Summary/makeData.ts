import { ColumnSort, SortingState } from '@tanstack/react-table'

export type Person = {
    jobId: string;
    agencyName: string;
    location: string;
    amenities: string;
    noOfPositions: number;
    media: string;
    postedDate: string;
    expiry: string;
}

export type PersonApiResponse = {
  data: Person[]
  meta: {
    totalRowCount: number
  }
}

const range = (len: number) => {
  const arr: number[] = []
  for (let i = 0; i < len; i++) {
    arr.push(i)
  }
  return arr
}

const newPerson = (index: number): Person => {
  return {
    "jobId": index + 1+"",
    "agencyName": "Aldhia HR Consultants",
    "location": "Dubai",
    "amenities": "Food,Transport,Stay,Recruitment",
    "noOfPositions": Math.floor(Math.random()*10),
    "media": "View Image",
    "postedDate": "9 Aug 2024",
    "expiry": "28 Sep 2024"
  }
}

export function makeData(...lens: number[]) {
  const makeDataLevel = (depth = 0): Person[] => {
    const len = lens[depth]!
    return range(len).map((d): Person => {
      return {
        ...newPerson(d),
      }
    })
  }

  return makeDataLevel()
}

const data = makeData(1000)

//simulates a backend api
export const fetchData = async (
  start: number,
  size: number,
  sorting: SortingState
) => {
  const dbData = [...data]
  if (sorting.length) {
    const sort = sorting[0] as ColumnSort
    const { id, desc } = sort as { id: keyof Person; desc: boolean }
    dbData.sort((a, b) => {
      if (desc) {
        return a[id] < b[id] ? 1 : -1
      }
      return a[id] > b[id] ? 1 : -1
    })
  }

  //simulate a backend api
  await new Promise(resolve => setTimeout(resolve, 200))

  return {
    data: dbData.slice(start, start + size),
    meta: {
      totalRowCount: dbData.length,
    },
  }
}
