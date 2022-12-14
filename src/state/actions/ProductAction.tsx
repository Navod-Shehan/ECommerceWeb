import {ProductActionType} from "../action-types/ProductActionType";
import {Product} from "../state-interfaces/Product";

interface AddAction {
  type: ProductActionType.ADD,
  payload: Product
}

interface RemoveAction {
  type: ProductActionType.REMOVE,
  payload: number
}

interface UpdateQtyAction {
  type: ProductActionType.UPDATE,
  payload: {
    itemIndex: number,
    item: Product
  }
}

interface ResetAction {
  type: ProductActionType.RESET,
  payload: null
}

export type ProductAction = AddAction | RemoveAction | UpdateQtyAction | ResetAction;