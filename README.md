# react-native-image-crop

Image crop editor component for iOS and Android. Move the image in the area and crop it. <br />

## Installation

This component is dependent of `react-native-image-resizer` [(See Github)](https://github.com/bamlab/react-native-image-resizer) which needs to be installed and linked to your project before.

If you don't have `rnpm` installed on your computer, install it first:

```
npm install -g rnpm
```

Then, install and link the peer dependency:

```
npm install --save react-native-image-resizer
rnpm link
```

Now you can install this component

```
npm install --save react-native-image-crop
```

## Usage

Import the component into the file you want to use it:

```js
import ImageCrop from 'react-native-image-crop';
```

Use the component directly in your code. The component will automatically fit the parent view.

```jsx
<View>
	<ImageCrop
		ref={(c) => { this.imageCrop = c; }}
		cropWidth={500}
		cropHeight={500}
		image={{
			uri: 'https://c1.staticflickr.com/9/8073/28582653114_d154039cb9_k.jpg',
		}}
	/>
</View>
```

To crop the image, you can call the method `crop()` from the component

```js
onButtonPress() {
	this.imageCrop.crop().then((uri) => {
	  // uri contains the cropped image
	});
}
```

Note: If you use a large image, you might need to preload it before using this component.


## Properties

|  	Property |  	Type |  	Description |
|---	|---	|---	|
|  	`image`|  	ImageSource <br>https://facebook.github.io/react-native/docs/image.html#source | Source of the image. <br> This property is mandatory |
|  	`containerPaddingLeft` |  	Number |  	Apply padding on the left of the image <br> Default: 20 |
|  	`containerPaddingRight` |  	Number |  	Apply padding on the right of the image <br> Default: 20 |
|  	`containerPaddingTop` |  	Number |  		Apply padding at the top of the image <br> Default: 20 |
|  	`containerPaddingBottom` |  	Number |  	Apply padding at the bottom of the image <br> Default: 20 |
|  	`cropWidth` |  	Number |  	Enforce the cropped width of the image. This property must be used with `cropHeight` |
|  	`cropHeight` |  	Number |  	Enforce the cropped height of the image. This property must be used with `cropWidth` |


## Methods

|  	Method |  	Description |  	 Example |
|---	|---	|---	|
|  	`crop()` |  	Crop and, if necessary, resize the image. This method returns a Promise. |  	`this.imageCrop.crop().then((uri) => { this.setState({ uri })})` |


## Todo

* Pinch and zoom. Add new properties `defaultZoom`, `minZoom`, `maxZoom`
