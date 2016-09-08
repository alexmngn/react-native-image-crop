import React, { Component } from 'react';
import {
	StyleSheet,
	Text,
	Dimensions,
	View,
	Image,
	TouchableOpacity,
} from 'react-native';

import ImageCrop from 'react-native-image-crop';

const WINDOW_WIDTH = Dimensions.get('window').width;
const WINDOW_HEIGHT = Dimensions.get('window').height;

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	button: {
		padding: 10,
		position: 'absolute',
		top: 20,
		right: 10,
		backgroundColor: '#fff',
	},
	imageCropContainer: {
		flex: 1,
		backgroundColor: '#000',
	},
});

export default class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			croppedImage: null,
			croppedImageRatio: 1,
		};
	}

	onButtonPress() {
		this.imageCrop.crop().then((uri) => {
			Image.getSize(uri, (width, height) => {
				this.setState({
					croppedImageRatio: (height / width),
					croppedImage: { uri },
				});
			}, () => {});
		});
	}

	render() {
		if (this.state.croppedImage) {
			return (
				<Image
					source={this.state.croppedImage}
					resizeMode="stretch"
					style={
						(this.state.croppedImageRatio <= 1) ? ({
							width: WINDOW_WIDTH,
							height: WINDOW_WIDTH * this.state.croppedImageRatio,
						}) : ({
							width: WINDOW_HEIGHT / this.state.croppedImageRatio,
							height: WINDOW_HEIGHT,
						})
					}
				/>
			);
		}

		return (
			<View style={styles.container}>
				<View style={styles.imageCropContainer}>
					<ImageCrop
						ref={(c) => { this.imageCrop = c; }}
						cropWidth={500}
						cropHeight={500}
						source={{
							uri: 'https://c1.staticflickr.com/9/8073/28582653114_d154039cb9_k.jpg',
						}}
					/>
				</View>
				<TouchableOpacity
					style={styles.button}
					onPress={() => this.onButtonPress()}
				>
					<Text>Crop</Text>
				</TouchableOpacity>
			</View>
		);
	}
}
