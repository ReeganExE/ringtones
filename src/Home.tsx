/* eslint-disable jsx-a11y/media-has-caption */
import { SyntheticEvent, useCallback, useRef, useState } from 'react'
import { useAsync } from 'react-async-hook'
import styled from 'styled-components'

import { getRingtones, RingtoneItem } from './ringtone'

function Body(): JSX.Element {
  const [page, setPage] = useState<number>(1)
  const [ringtoneItems, setRingtoneItems] = useState<RingtoneItem[]>()

  const { loading } = useAsync(
    (page: number) => getRingtones(page).then((items) => setRingtoneItems((l) => (l ? [...l, ...items] : items))),
    [page]
  )
  const prevRef = useRef<HTMLAudioElement>()

  const onPlay = useCallback((e: SyntheticEvent<Element>) => {
    const newAu = e.target as HTMLAudioElement
    if (prevRef.current && prevRef.current !== newAu) {
      prevRef.current.pause()
      prevRef.current.currentTime = 0
    }
    prevRef.current = newAu

    e.currentTarget.classList.add('played')
  }, [])

  const onLoadMoreClick = useCallback(() => {
    setPage((p) => p + 1)
  }, [])

  if (!ringtoneItems) {
    return <Loading />
  }

  return (
    <>
      {ringtoneItems.map((r, idx) => (
        <div key={r.id} className="row justify-content-md-center">
          <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-4">
            <RingtoneContainer onPlay={onPlay}>
              <IndexSpan>#{idx + 1}</IndexSpan>
              <h5>{r.title}</h5>
              <audio controls src={r.meta.previewUrl} />
            </RingtoneContainer>
          </div>
        </div>
      ))}
      <div className="row justify-content-md-center">
        <div className="col-12 col-sm-12 col-md-8 col-lg-4 justify-content-center d-flex">
          <Button disabled={loading} type="button" onClick={onLoadMoreClick}>
            {loading ? 'Loading ...' : 'Load more'}
          </Button>
        </div>
      </div>
    </>
  )
}

function Loading(): JSX.Element {
  return (
    <div className="row justify-content-md-center">
      <div className="col justify-content-center d-flex">Loading ...</div>
    </div>
  )
}

function Home(): JSX.Element {
  return (
    <Container className="container py-4">
      <Body />
    </Container>
  )
}

const IndexSpan = styled.span`
  position: absolute;
  right: 6px;
  font-size: 12px;
  color: #757575;
`

const Button = styled.button`
  :active {
    background: rgba(26, 115, 232, 0.8);
  }
  :hover:not(:active):not(:disabled) {
    background: rgba(26, 115, 232, 0.9);
  }
  :disabled {
    background: rgb(241, 243, 244);
    color: rgb(128, 134, 139);
    cursor: default;
  }
  background: rgb(26, 115, 232);
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
  font: inherit;
  height: 2.5em;
  outline: none;
  padding: 0.5em 1em;
`

const RingtoneContainer = styled.div`
  margin-bottom: 10px;
  padding: 7px 20px 16px;
  width: 100%;
  border: solid 1px #cccccc;
  box-shadow: 0 0 2px 0px #909090;
  border-radius: 4px;
  position: relative;
  &.played {
    background: #26c6da;
    color: white;
    ${IndexSpan} {
      color: #e0e0e0;
    }
  }
`
const Container = styled.div`
  audio {
    width: 100%;
  }
  h5 {
    font-size: 1rem;
  }
`

export default Home
