import React, { useEffect, useState } from 'react'
import './App.css'
import {
  Container, Form, InputGroup, Spinner
} from 'react-bootstrap'

function App (): JSX.Element {
  const [valutes, setValutes] = useState<Record<string, any>>({})
  const [loaded, setLoaded] = useState(false)
  const [rate, setRate] = useState<number>(1)
  const [selectedValute, setSelectedValute] = useState<string>(localStorage.getItem('selectedValute') ?? 'AUD')
  const [exchangeRate, setExchangeRate] = useState<string | null>(localStorage.getItem('selectedRate'))

  useEffect(() => {
    fetch('https://www.cbr-xml-daily.ru/daily_json.js')
      .then(async (response) => await response.json())
      .then((data) => {
        setLoaded(true)
        setValutes(data)
      })
      .catch((error) => {
        setLoaded(false)
        console.error(error)
      })
  }, [])

  const handleValuteChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    setSelectedValute(event.target.value)
    localStorage.setItem('selectedValute', event.target.value)
  }

  useEffect(() => {
    if (Boolean(valutes?.Valute) && Boolean(valutes?.Valute[selectedValute])) {
      const exchange = rate * valutes.Valute[selectedValute].Value
      setExchangeRate(String(exchange))
      localStorage.setItem('selectedRate', String(valutes.Valute[selectedValute].Value))
    }
  }, [selectedValute, rate])

  if (!loaded) {
    return (
      <Container className="d-flex align-items-center justify-content-center vh-100">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    )
  }

  return (
    <Container className="d-flex flex-column align-items-center" style={{ width: '600px' }}>
      <h1>Конвертер Валют</h1>
      <br />
      <Form.Group className="mb-3" style={{ width: '100%' }}>
        <Form.Label>Сумма</Form.Label>
        <InputGroup>
          <Form.Control
            className="text-end"
            type="number"
            aria-label="Сумма"
            aria-describedby="inputGroup-sizing-default"
            value={rate}
            onChange={(event) => { setRate(parseFloat(event.target.value)) }}
          />
        </InputGroup>
      </Form.Group>
      <br />
      <Form.Group className="mb-3" style={{ width: '100%' }}>
        <Form.Label>Выберите валюту</Form.Label>
        <Form.Select
          className="text-start"
          aria-label="Выберите валюту"
          value={selectedValute ?? ''}
          onChange={handleValuteChange}
          required
        >
          {Boolean(valutes.Valute) &&
            Object.keys(valutes.Valute).map((valute) => (
              <option key={valute} value={valute}>
                {`${valute} (${String(valutes.Valute[valute].Name)})`}
              </option>
            ))}
        </Form.Select>
      </Form.Group>
      <br />
      <Form.Group className="mb-3" style={{ width: '100%' }}>
        <Form.Label>Результат</Form.Label>
        <InputGroup className="mb-3" style={{ width: '100%' }}>
          <Form.Control
            className="text-end"
            readOnly
            aria-label="Результат"
            aria-describedby="inputGroup-sizing-default"
            type="text"
            value={exchangeRate ?? ''}
          />
        <InputGroup.Text>₽</InputGroup.Text>
        </InputGroup>
      </Form.Group>

      <br />
    </Container>
  )
}

export default App
