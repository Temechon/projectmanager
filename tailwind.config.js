module.exports = {
  mode: 'jit',
  purge: {
    enabled: true,
    content: [
      './src/**/*.{html,ts,scss}',
    ]
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        'primary': '#3366FF',
        'primary-50': '#F3F6FF',
        'primary-200': '#b5c7ff',
        'secondary': '#F80A50',
        'secondary-700': '#c4093e',
        'accent': '#3ECEE5',
        'mygreen': '#37BA83',
        'mylightgray': '#f6f7fc',
        'darker': '#323659',
        'darker-200': '#3f4570'


      },
      fontFamily: {
        sans: ['Jost', 'sans-serif'],
        display: ['Jost', 'sans-serif']
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
