# fns
A Collection of declarative React components that wrap imperative code.

## InView.jsx
Component that on Scroll, fires an event denoting if a targeted element is inside the bounds of the view port. 

Good for stuff like starting and stopping a video if it is scrolled out of the view port.
### Usage
``` jsx 
<InView target={'#myTarget'} handleViewChange={this.handleViewChange}/>
```
`target` - CSS Selector for the element you want to observe.

`handleViewChange` - Method to call. Your function will be passed a boolean.

Check out example at - ```javascript_libs/microzine-3.2/views/partials/video/Zumobivideoyoutube.jsx```

## VideoJsMetrics.jsx 
Component that fires video metrics for VideoJS and Brightcove videos.
### Usage
``` jsx 
<VideoJsMetrics videoplayer={this.state.videoplayer} />
```
`videoplayer` - Ref to videoJS or Brightcove video player.

Check out example at - ```javascript_libs/microzine-3.2/views/partials/video/Zumobivideobrightcove.jsx```
