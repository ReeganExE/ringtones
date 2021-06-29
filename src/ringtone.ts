const MAX_PAGE_SIZE = Number(process.env.REACT_APP_MAX_PAGE_SIZE) || 5

export function getRingtones(page = 1): Promise<RingtoneItem[]> {
  const myHeaders = new Headers()
  myHeaders.append('Content-Type', 'application/json')

  const raw = JSON.stringify({
    query: `
    query search($input: SearchAsUgcInput!) {
      searchAsUgc(input: $input) {
        ...browseContentItemsResource
      }
    }
    fragment browseContentItemsResource on BrowseContentItems {
      page
      total
      items {
        ... on BrowseWallpaper {
          id
          contentType
          title
          tags
          imageUrl
          placeholderUrl
          licensed
        }

        ... on BrowseRingtone {
          id
          contentType
          title
          tags
          imageUrl
          placeholderUrl
          licensed
          meta {
            durationMs
            previewUrl
            gradientStart
            gradientEnd
          }
        }
      }
    }
`,
    variables: { input: { contentType: 'RINGTONE', keyword: 'short', page, size: MAX_PAGE_SIZE } },
  })

  const requestOptions: RequestInit = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow',
  }

  return fetch('/tones/', requestOptions)
    .then<RingtonesResp>((response) => response.json())
    .then((result) => result.data.searchAsUgc.items)
}

interface RingtonesResp {
  data: {
    searchAsUgc: {
      page: number
      total: number
      items: RingtoneItem[]
    }
  }
}

export interface RingtoneItem {
  id: string
  contentType: string
  title: string
  tags: string[]
  imageUrl: string
  placeholderUrl: string
  licensed: boolean
  meta: Meta
}

interface Meta {
  durationMs: number
  previewUrl: string
  gradientStart: string
  gradientEnd: string
}
