import React from 'react'
import {initialWeek, renderRange, eventBuffer, calcWeeks} from '../src/containerParts'
import {mount} from 'enzyme'

describe('containerParts', () => {
  // tests for the individual parts of the container
  const Dummy = () => <div className='dummy'/>

  describe('calcWeeks', () => {
    it('should pass empty weeks if no events provided', () => {
      const Element = calcWeeks(props => <Dummy {...props} />)
      const events = []
      const wrapper = mount(<Element events={events} renderRange={{start: 5, stop: 10}} min='2016-01-01'/>)

      wrapper.find(Dummy).should.have.prop('renderWeeks').that.is.an('array').and.has.length(5)
      const weeks = wrapper.find(Dummy).prop('renderWeeks')
      for(let w of weeks) {
        for(let d of w) {
          d.events.should.eql([])
        }
      }
    })

    it('should not include events out of range', () => {
      const Element = calcWeeks(props => <Dummy {...props} />)
      const events = [{start: '2016-01-05', end: '2016-01-20', id: '123', title: 'Some Event'}]
      const wrapper = mount(<Element events={events} renderRange={{start: 5, stop: 10}} min='2016-01-01'/>)
      const weeks = wrapper.find(Dummy).prop('renderWeeks')
      for(let w of weeks) {
        for(let d of w) {
          d.events.should.eql([])
        }
      }
    })

    it('should pass events grouped by week', () => {
      const Element = calcWeeks(props => <Dummy {...props} />)
      const events = [{start: '2016-02-20', end: '2016-04-20', id: '123', title: 'Some Event'}]
      const wrapper = mount(<Element events={events} renderRange={{start: 5, stop: 10}} min='2015-12-28'/>)

      const weeks = wrapper.find(Dummy).prop('renderWeeks')
      // not before
      weeks[2][4].events.should.have.length(0)
      // included on the day we start (7th week, on Saturday)
      weeks[2][5].events.should.have.length(1)
      // and repeat on following weeks
      weeks[3][0].events.should.have.length(1)
    })
  })

  describe('renderRange', () => {
    it('should pass renderRange based on initial date', () => {
      const Element = renderRange(props => <Dummy {...props} />)
      const wrapper = mount(<Element initialWeekIndex={30} visibleWeekCount={5}/>)
      wrapper.find(Dummy).prop('renderRange').should.eql({start: 26, stop: 39})
    })

    it('should update renderRange', () => {
      const Element = renderRange(props => <Dummy {...props} />)
      const wrapper = mount(<Element initialWeekIndex={30} visibleWeekCount={5}/>)
      wrapper.find(Dummy).prop('setRenderRange')({start: 10, stop: 16})
      wrapper.find(Dummy).prop('renderRange').should.eql({start: 10, stop: 16})
    })
  })

  describe('initialWeek', () => {
    it('should calculate totalWeekCount based on min and max', () => {
      const Element = initialWeek(props => <Dummy {...props} />)
      const wrapper = mount(<Element min='2016-01-01' max='2018-01-01'/>)
      wrapper.find(Dummy).prop('totalWeekCount').should.eql(104)
    })

    it('should calculate initialWeekIndex', () => {
      const Element = initialWeek(props => <Dummy {...props} />)
      const wrapper = mount(<Element min='2016-01-01' max='2018-01-01' initialDate='2016-05-20'/>)
      wrapper.find(Dummy).prop('initialWeekIndex').should.eql(20)
    })

    it('adjusts min to be on start of week, if needed', () => {
      const Element = initialWeek(props => <Dummy {...props} />)
      const wrapper = mount(<Element min='2016-01-01' max='2018-01-01' initialDate='2016-05-20'/>)
      wrapper.find(Dummy).should.have.prop('min')
      wrapper.find(Dummy).prop('min').format('YYYY-MM-DD').should.eql('2015-12-28')
    })
  })

  describe('eventBuffer', () => {
    it('should update renderRange and call onLoadEvents when range is modified by a lot', () => {
      const Element = eventBuffer(props => <Dummy {...props} />)
      const setRenderRangeProp = sinon.spy()
      const onLoadEventsProp = sinon.spy()
      const wrapper = mount(<Element
        onLoadEvents={onLoadEventsProp}
        min='2016-01-01'
        setRenderRange={setRenderRangeProp} renderRange={{start: 40, stop: 46}}/>)
      const setRenderRange = wrapper.find(Dummy).prop('setRenderRange')
      setRenderRange({start: 10, stop: 16})
      setRenderRangeProp.should.have.been.calledWith({start: 10, stop: 16})
      wrapper.find(Dummy).prop('bufferRange').should.eql({start: 10 - 4, stop: 16 + 4})
      // Monday - Sunday
      onLoadEventsProp.should.have.been.calledWith({start: '2016-02-08', stop: '2016-05-22'})
    })

    it('should update renderRange without calling onLoadEvents if range is modified a little', () => {
      const Element = eventBuffer(props => <Dummy {...props} />)
      const setRenderRangeProp = sinon.spy()
      const onLoadEventsProp = sinon.spy()
      const wrapper = mount(<Element
        onLoadEvents={onLoadEventsProp}
        setRenderRange={setRenderRangeProp} renderRange={{start: 40, stop: 46}}/>)
      const setRenderRange = wrapper.find(Dummy).prop('setRenderRange')
      // first scroll, we are going to have a reset of the range, because we default to just the render range
      setRenderRange({start: 42, stop: 48})
      setRenderRangeProp.reset()
      onLoadEventsProp.reset()
      setRenderRange({start: 44, stop: 50})
      setRenderRangeProp.should.have.been.calledWith({start: 44, stop: 50})
      // noinspection BadExpressionStatementJS
      onLoadEventsProp.should.not.have.been.called
    })

    it('should call onLoadEvent during initial mount', () => {

    })
  })
  //
  //
  // it('should pass totalWeekCount and initialWeekIndex', () => {
  //
  // })
})