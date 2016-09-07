# react-native-image-crop

Image crop editor component for iOS and Android

## Usage

Install the Component

```
npm install react-native-image-crop
```

Import it

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
