import { create } from 'zustand'

const useBear = create((set) => ({
  quote:{
    text: '',
    author: ''
  }
}))
