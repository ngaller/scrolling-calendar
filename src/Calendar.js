import React from 'react'
import PropTypes from 'prop-types'
import VirtualList from 'react-tiny-virtual-list'
import {OVERSCAN} from './constants'
import WeekRow from './components/WeekRow'
import weekToDate from './lib/weekToDate'

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
    visibleWeekCount: PropTypes.number,
    // total # of weeks
    totalWeekCount: PropTypes.number.isRequired,
    // the week to initially scroll to
    initialWeekIndex: PropTypes.number.isRequired,
    min: PropTypes.object.isRequired
  }

  initRef = (ref) => {
    this.listRef = ref
  }

  onScroll = (offset) => {
    const {start, stop} = this.listRef.sizeAndPositionManager.getVisibleRange({
      offset,
      containerSize: 600,
      overscanCount: OVERSCAN
    })
    this.props.setRenderRange({start, stop})
  }

  // what is the height of the week row?
  getWeekSize = (index) => {
    return 194
  }

  renderWeek = ({index, style}) =>
    <WeekRow key={index}
             week={this.props.renderWeeks[index - this.props.renderRange.start]}
             startOfWeek={weekToDate(this.props.min, index)}
             style={style}/>

  render() {
    const estimatedSize = 194
    return <VirtualList ref={this.initRef}
                        height={600}
                        width="100%"
                        renderItem={this.renderWeek}
                        itemCount={this.props.totalWeekCount}
                        scrollOffset={this.props.initialWeekIndex * estimatedSize}
                        itemSize={this.getWeekSize}
                        estimatedItemSize={estimatedSize}
                        overscanCount={OVERSCAN}
                        onScroll={this.onScroll}/>
  }
}

export default Calendar