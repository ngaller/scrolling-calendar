import React from 'react'
import PropTypes from 'prop-types'
import Header from './components/Header'
import EventList from './components/EventList'
import moment from 'moment'
import styled from 'styled-components'

const FlexColumn = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`

const HeaderStyle = styled.div`
  flex: 0;
`
const ContainerStyle = styled.div`
  flex: 1;
`

class Calendar extends React.Component {
  // noinspection JSUnusedGlobalSymbols
  static propTypes = {
    // used to update the {start, stop} index that are shown
    // (not necessarily visible on the screen, but rendered on the DOM)
    // will be invoked when the user scrolls, the parent should then
    // update renderStartIndex and renderWeeks
    setRenderRange: PropTypes.func.isRequired,
    // the index of the first week to be rendered
    renderRange: PropTypes.shape({
      start: PropTypes.number.isRequired,
      stop: PropTypes.number.isRequired
    }).isRequired,
    // the weeks (array of days) that are rendered
    renderWeeks: PropTypes.array.isRequired,
    // how many weeks to actually paint on the screen
    visibleWeekCount: PropTypes.number.isRequired,
    // total # of weeks
    totalWeekCount: PropTypes.number.isRequired,
    // the week to initially scroll to
    initialWeekIndex: PropTypes.number.isRequired,
    min: PropTypes.object.isRequired,
    today: PropTypes.instanceOf(moment).isRequired,
    currentMonth: PropTypes.instanceOf(moment).isRequired,
    eventRenderer: PropTypes.func,
    onEventClick: PropTypes.func,
    // a flag used to signify we need to re-render the list
    updatedFlag: PropTypes.any,
    sizeCalculator: PropTypes.func.isRequired,
    className: PropTypes.string.isRequired
  }

  state = {
    calculatedHeight: 0
  }

  initContainerRef = (ref) => {
    this.containerRef = ref
    if(ref) {
      this.setState({
        calculatedHeight: ref.getBoundingClientRect().height
      })
    }
  }

  render() {
    return <FlexColumn className={this.props.className}>
      <HeaderStyle>
        <Header month={this.props.currentMonth}/>
      </HeaderStyle>
      <ContainerStyle innerRef={this.initContainerRef}>
        {this.state.calculatedHeight && <EventList {...this.props} containerHeight={this.state.calculatedHeight} />}
      </ContainerStyle>
    </FlexColumn>
  }
}

export default Calendar
