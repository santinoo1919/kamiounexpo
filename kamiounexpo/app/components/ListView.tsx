import { ForwardedRef, forwardRef, PropsWithoutRef, ReactElement, RefObject } from "react"
import { FlatList } from "react-native"
import { FlashList, FlashListProps } from "@shopify/flash-list"

import { isRTL } from "@/i18n"

export type ListViewRef<T> = FlashList<T> | FlatList<T>

export type ListViewProps<T> = PropsWithoutRef<FlashListProps<T>> & {
  masonry?: boolean
  optimizeItemArrangement?: boolean
}

/**
 * This is a Higher Order Component meant to ease the pain of using @shopify/flash-list
 * when there is a chance that a user would have their device language set to an
 * RTL language like Arabic or Persian. This component will use react-native's
 * FlatList if the user's language is RTL or FlashList if the user's language is LTR.
 *
 * Because FlashList's props are a superset of FlatList's, you must pass estimatedItemSize
 * to this component if you want to use it.
 *
 * Masonry layout is supported for FlashList (LTR languages only).
 * @see {@link https://github.com/Shopify/flash-list/issues/544|RTL Bug Android}
 * @see {@link https://github.com/Shopify/flash-list/issues/840|Flashlist Not Support RTL}
 * @see {@link https://shopify.github.io/flash-list/docs/guides/masonry/|Masonry Layout Guide}
 * @param {FlashListProps | FlatListProps} props - The props for the `ListView` component.
 * @param {RefObject<ListViewRef>} forwardRef - An optional forwarded ref.
 * @returns {JSX.Element} The rendered `ListView` component.
 */
const ListViewComponent = forwardRef(
  <T,>(props: ListViewProps<T>, ref: ForwardedRef<ListViewRef<T>>) => {
    const { masonry, optimizeItemArrangement, ...restProps } = props
    const ListComponentWrapper = isRTL ? FlatList : FlashList

    // For RTL languages, we can't use masonry (FlashList only)
    if (isRTL && masonry) {
      console.warn(
        "Masonry layout is not supported for RTL languages. Falling back to regular layout.",
      )
    }

    return (
      <ListComponentWrapper
        {...restProps}
        ref={ref}
        // Only apply masonry props for FlashList (LTR)
        {...(isRTL ? {} : { masonry, optimizeItemArrangement })}
      />
    )
  },
)

ListViewComponent.displayName = "ListView"

export const ListView = ListViewComponent as <T>(
  props: ListViewProps<T> & {
    ref?: RefObject<ListViewRef<T> | null>
  },
) => ReactElement
