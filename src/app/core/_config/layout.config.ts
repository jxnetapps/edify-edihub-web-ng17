import {LayoutConfigModel} from '../_base/layout';

export class LayoutConfig {
	public defaults: LayoutConfigModel = {
		'demo': 'default',
		// == Base Layout
		'self': {
			'layout': 'fluid', // fluid|boxed
			'body': {
				'background-image': './assets/media/misc/bg-1.jpg',
			},
			'logo': {
				'dark': './assets/media/logos/logo-light.svg',
				'light': './assets/media/logos/logo-dark.svg',
				'brand': './assets/media/logos/logo-light.svg',
				'green': './assets/media/logos/logo-light.svg',
			},
		},
		// == Page Splash Screen loading
		'loader': {
			'enabled': true,
			'type': 'spinner-logo',
			'logo': './assets/media/logos/book-loader.gif',
			'message': 'Please wait...',
		},
		// == Colors for javascript
		'colors': {
			'state': {
				'brand': '#5d78ff',
				'dark': '#282a3c',
				'light': '#ffffff',
				'primary': '#5867dd',
				'success': '#34bfa3',
				'info': '#36a3f7',
				'warning': '#ffb822',
				'danger': '#fd3995',
			},
			'base': {
				'label': [
					'#c5cbe3',
					'#a1a8c3',
					'#3d4465',
					'#3e4466',
				],
				'shape': [
					'#f0f3ff',
					'#d9dffa',
					'#afb4d4',
					'#646c9a',
				],
			},
		},
		'header': {
			'self': {
				'skin': 'light',
      			"width": "fluid",
				'fixed': {
					'desktop': true,
					'mobile': true,
				},
			},
			'menu': {
				'self': {
					'display': true,
					'layout': 'default',
					'root-arrow': false
				},
				'desktop': {
					'arrow': true,
					'toggle': 'click',
					'submenu': {
						'skin': 'light',
						'arrow': true,
					},
				},
				'mobile': {
					'submenu': {
						'skin': 'light',
						'accordion': true,
					},
				},
			},
		},
		'subheader': {
			'display': true,
			'layout': 'subheader-v1',
			'fixed': true,
			'width': 'fluid',
			'style': 'solid'
		},
		'content': {
			'width': 'fluid',
		},
		'brand': {
			'self': {
				'skin': 'light',
			},
		},
		'aside': {
			'self': {
				'skin': 'light',
				'display': false, //TODO -side nav bar
				'fixed': true,
				'minimize': {
					'toggle': true,
					'default': false, //TOodo
				},
			},
			'footer': {
				'self': {
					'display': true,
				},
			},
			'menu': {
				'dropdown': false, //ToDO 'dropdown': true
				'scroll': true,
				'submenu': {
					'accordion': true,
					'dropdown': {
						'arrow': true,
						'hover-timeout': 500,
					},
				},
			},
		},
		'footer': {
			'self': {
				'width': 'fluid',
			},
		},
	};

	/**
	 * Good place for getting the remote config
	 */
	public get configs(): LayoutConfigModel {
		return this.defaults;
	}
}
