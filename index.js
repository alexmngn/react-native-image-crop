import React, { Component, PropTypes } from 'react';
import {
	View,
	Image,
	StyleSheet,
	ImageEditor,
	PanResponder,
} from 'react-native';

import ImageResizer from 'react-native-image-resizer';

const styles = StyleSheet.create({
	container: {
		flex: 1,
		position: 'relative',
		overflow: 'hidden',
	},
	imageWrapper: {
		overflow: 'hidden',
	},
	image: {
		position: 'absolute',
	},
	cropContainer: {
		position: 'absolute',
		overflow: 'hidden',
	},
});

class ImageCrop extends Component {
	static propTypes = {
		source: PropTypes.any.isRequired,
		containerPaddingLeft: PropTypes.number,
		containerPaddingRight: PropTypes.number,
		containerPaddingTop: PropTypes.number,
		containerPaddingBottom: PropTypes.number,
		cropWidth: PropTypes.number,
		cropHeight: PropTypes.number,
	}

	static defaultProps = {
		containerPaddingTop: 20,
		containerPaddingLeft: 20,
		containerPaddingRight: 20,
		containerPaddingBottom: 20,
	}

	constructor(props) {
		super(props);

		this.previousImageTop = 0;
		this.previousImageLeft = 0;

		this.state = {
			originalImageWidth: null,
			originalImageHeight: null,
			imageWidth: null,
			imageHeight: null,
			imageTop: 0,
			imageLeft: 0,
			imageSizeRatio: 1,
			containerWidth: null,
			containerHeight: null,
			containerRatio: null,
			cropPaddingLeft: 0,
			cropPaddingRight: 0,
			cropPaddingTop: 0,
			cropPaddingBottom: 0,
		};
	}

	componentWillMount() {
		this.panResponder = this.getPanResponder();
	}

	componentDidMount() {
		Image.getSize(this.props.source, (originalImageWidth, originalImageHeight) => {
			this.setState({ originalImageWidth, originalImageHeight });
		}, () => {});
	}

	componentDidUpdate() {
		if (this.state.originalImageWidth && this.state.containerWidth && !this.state.imageWidth) {
			this.setCropArea();
		}
	}

	getTotalPaddingTop() {
		return this.props.containerPaddingTop + this.state.cropPaddingTop;
	}

	getTotalPaddingBottom() {
		return this.props.containerPaddingBottom + this.state.cropPaddingBottom;
	}

	getTotalPaddingTopBottom() {
		return this.getTotalPaddingTop() + this.getTotalPaddingBottom();
	}

	getTotalPaddingLeft() {
		return this.props.containerPaddingLeft + this.state.cropPaddingLeft;
	}

	getTotalPaddingRight() {
		return this.props.containerPaddingRight + this.state.cropPaddingRight;
	}

	getTotalPaddingLeftRight() {
		return this.getTotalPaddingLeft() + this.getTotalPaddingRight();
	}

	getPanResponder() {
		return PanResponder.create({
			onMoveShouldSetPanResponderCapture: () => true,
			onPanResponderMove: (event, { dx, dy }) => {
				let imageTop = this.previousImageTop + dy;
				let imageLeft = this.previousImageLeft + dx;
				const limitLeft = (
					this.state.containerWidth -
					this.state.imageWidth -
					this.getTotalPaddingRight()
				);
				const limitTop = (
					this.state.containerHeight -
					this.state.imageHeight -
					this.getTotalPaddingBottom()
				);
				const paddingLeft = this.getTotalPaddingLeft();
				const paddingTop = this.getTotalPaddingTop();

				if (imageLeft > paddingLeft) {
					imageLeft = paddingLeft;
				} else if (imageLeft < limitLeft) {
					imageLeft = limitLeft;
				}

				if (imageTop > paddingTop) {
					imageTop = paddingTop;
				} else if (imageTop < limitTop) {
					imageTop = limitTop;
				}

				this.setState({
					imageTop,
					imageLeft,
				});
			},
			onPanResponderEnd: (event, { dx, dy }) => {
				const limitLeft = (
					(
						this.state.imageWidth -
						this.state.containerWidth
					) +
					this.getTotalPaddingLeftRight()
				);
				const limitTop = (
					(
						this.state.imageHeight -
						this.state.containerHeight
					) +
					this.getTotalPaddingTopBottom()
				);
				const paddingLeft = this.getTotalPaddingLeft();
				const paddingTop = this.getTotalPaddingTop();

				this.previousImageLeft += dx;
				this.previousImageTop += dy;

				if (this.previousImageLeft > paddingLeft) {
					this.previousImageLeft = paddingLeft;
				} else if (this.previousImageLeft < -limitLeft) {
					this.previousImageLeft = -limitLeft;
				}

				if (this.previousImageTop > paddingTop) {
					this.previousImageTop = paddingTop;
				} else if (this.previousImageTop < -limitTop) {
					this.previousImageTop = -limitTop;
				}
			},
		});
	}

	/**
	 * Sets the image size and position to create the crop area
	 */
	setCropArea() {
		let imageWidth = 0;
		let imageHeight = 0;
		let imageLeft = 0;
		let imageTop = 0;
		let cropPaddingLeft = 0;
		let cropPaddingRight = 0;
		let cropPaddingTop = 0;
		let cropPaddingBottom = 0;
		let cropRatio = 1;
		const imageRatio = this.state.originalImageHeight / this.state.originalImageWidth;
		const containerRatio = this.state.containerHeight / this.state.containerWidth;

		if (this.props.cropWidth && this.props.cropHeight) {
			cropRatio = this.props.cropHeight / this.props.cropWidth;

			if (containerRatio < cropRatio) {
				cropPaddingLeft = cropPaddingRight = (
					this.state.containerWidth - (
						(
							this.state.containerHeight -
							this.props.containerPaddingTop -
							this.props.containerPaddingBottom
						) / cropRatio
					) -
					this.props.containerPaddingLeft -
					this.props.containerPaddingRight
				) / 2;
			} else {
				cropPaddingTop = cropPaddingBottom = (
					this.state.containerHeight - (
						(
							this.state.containerWidth -
							this.props.containerPaddingLeft -
							this.props.containerPaddingRight
						) * cropRatio
					) -
					this.props.containerPaddingTop -
					this.props.containerPaddingBottom
				) / 2;
			}
		}

		if (imageRatio < cropRatio) {
			imageHeight = this.state.containerHeight - (
				this.props.containerPaddingTop +
				this.props.containerPaddingBottom +
				cropPaddingTop +
				cropPaddingBottom
			);
			imageWidth = (imageHeight / this.state.originalImageHeight) * this.state.originalImageWidth;
			imageLeft = (this.state.containerWidth / 2) - (imageWidth / 2);
			imageTop = this.props.containerPaddingTop + cropPaddingTop;
		} else {
			imageWidth = this.state.containerWidth - (
				this.props.containerPaddingLeft +
				this.props.containerPaddingRight +
				cropPaddingLeft +
				cropPaddingRight
			);
			imageHeight = (imageWidth / this.state.originalImageWidth) * this.state.originalImageHeight;
			imageLeft = this.props.containerPaddingLeft + cropPaddingLeft;
			imageTop = (this.state.containerHeight / 2) - (imageHeight / 2);
		}

		const imageSizeRatio = imageHeight / this.state.originalImageHeight;

		this.setState({
			imageWidth,
			imageHeight,
			imageLeft,
			imageTop,
			imageSizeRatio,
			cropPaddingLeft,
			cropPaddingRight,
			cropPaddingTop,
			cropPaddingBottom,
		});

		this.previousImageLeft = imageLeft;
		this.previousImageTop = imageTop;
	}

	crop() {
		const cropData = {
			offset: {
				x: -(
					this.state.imageLeft - this.getTotalPaddingLeft()
				) / this.state.imageSizeRatio,
				y: -(
					this.state.imageTop - this.getTotalPaddingTop()
				) / this.state.imageSizeRatio,
			},
			size: {
				width: (
					this.state.containerWidth - this.getTotalPaddingLeftRight()
				) / this.state.imageSizeRatio,
				height: (
					this.state.containerHeight - this.getTotalPaddingTopBottom()
				) / this.state.imageSizeRatio,
			},
		};

		return new Promise((resolve, reject) => {
			ImageEditor.cropImage(
				this.props.source,
				cropData,
				(croppedUri) => {
					if (this.props.cropWidth && this.props.cropHeight) {
						this.resize(croppedUri).then((resizedUri) =>
							resolve(resizedUri)
						);
					} else {
						resolve(croppedUri);
					}
				},
				(failure) => reject(failure)
			);
		});
	}

	resize(uri) {
		const { cropWidth, cropHeight } = this.props;
		return ImageResizer.createResizedImage(uri, cropWidth, cropHeight, 'JPEG', 100, 0, null);
	}

	renderImage(isLower = false) {
		if (this.state.imageWidth) {
			return (
				<View
					style={[styles.imageWrapper, {
						width: (isLower ?
							this.state.containerWidth :
							this.state.containerWidth - this.getTotalPaddingLeftRight()
						),
						height: (isLower ?
							this.state.containerHeight :
							this.state.containerHeight - this.getTotalPaddingTopBottom()
						),
						top: (isLower ? 0 : this.state.cropPaddingTop),
						left: (isLower ? 0 : this.state.cropPaddingLeft),
					}]}
				>
					<Image
						resizeMode="cover"
						source={this.props.source}
						style={[styles.image, {
							width: this.state.imageWidth,
							height: this.state.imageHeight,
							left: this.state.imageLeft + (isLower ? 0 : -this.getTotalPaddingLeft()),
							top: this.state.imageTop + (isLower ? 0 : -this.getTotalPaddingTop()),
							opacity: (isLower ? 0.5 : 1),
						}]}
					/>
				</View>
			);
		}
		return null;
	}

	render() {
		return (
			<View
				style={styles.container}
				onLayout={(event) => {
					const { width, height } = event.nativeEvent.layout;
					this.setState({
						containerWidth: width,
						containerHeight: height,
						containerRatio: height / width,
					});
				}}
				{...this.panResponder.panHandlers}
			>
				{ this.renderImage(true) }
				<View
					style={[styles.cropContainer, {
						top: this.props.containerPaddingTop,
						bottom: this.props.containerPaddingBottom,
						left: this.props.containerPaddingLeft,
						right: this.props.containerPaddingRight,
						width: (
							this.state.containerWidth -
							this.props.containerPaddingLeft -
							this.props.containerPaddingRight
						),
						height: (
							this.state.containerHeight -
							this.props.containerPaddingTop -
							this.props.containerPaddingBottom
						),
					}]}
				>
					{ this.renderImage() }
				</View>
			</View>
		);
	}
}

export default ImageCrop;
