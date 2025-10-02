"use client";

import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { ChevronUpDownIcon, CheckIcon } from "@heroicons/react/20/solid";
import Image from "next/image";
import { Asset } from "@/lib/constants";

type Props = {
  value: string; // symbol e.g. "USDT-ETH"
  onChange: (symbol: string) => void;
  assets: Asset[];
};

export function AssetSelect({ value, onChange, assets }: Props) {
  const selected = assets.find((a) => a.symbol === value);

  return (
    <div className="w-56">
      <Listbox value={value} onChange={onChange}>
        <div className="relative">
          {/* Button */}
          <Listbox.Button
            className="relative w-full cursor-pointer rounded-xl border border-zinc-200 bg-white pl-9 pr-10 py-2 text-sm text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            {selected && (
              <span className="absolute inset-y-0 left-2 flex items-center">
                <Image
                  src={`/coins/${selected.symbol.toLowerCase().replace(/[-]/g, "")}.svg`}
                  alt={selected.name}
                  width={20}
                  height={20}
                />
              </span>
            )}
            <span className="block truncate">
              {selected ? `${selected.symbol} — ${selected.name}` : "Select asset"}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
              <ChevronUpDownIcon className="h-5 w-5 text-zinc-400" />
            </span>
          </Listbox.Button>

          {/* Options */}
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options
              className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-xl border border-zinc-200 bg-white py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
            >
              {assets.map((a) => {
                const icon = a.symbol.toLowerCase().replace(/[-]/g, "");
                return (
                  <Listbox.Option
                    key={a.symbol}
                    className={({ active }) =>
                      `relative cursor-pointer select-none py-2 pl-9 pr-10 ${
                        active ? "bg-blue-50 text-blue-900" : "text-zinc-700"
                      }`
                    }
                    value={a.symbol}
                  >
                    {({ selected }) => (
                      <>
                        {/* Icon */}
                        <span className="absolute inset-y-0 left-2 flex items-center">
                          <Image
                            src={`/coins/${icon}.svg`}
                            alt={a.name}
                            width={18}
                            height={18}
                          />
                        </span>

                        {/* Label */}
                        <span className={`block truncate ${selected ? "font-medium" : "font-normal"}`}>
                          {a.symbol} — {a.name}
                        </span>

                        {/* Checkmark */}
                        {selected && (
                          <span className="absolute inset-y-0 right-2 flex items-center text-blue-600">
                            <CheckIcon className="h-5 w-5" />
                          </span>
                        )}
                      </>
                    )}
                  </Listbox.Option>
                );
              })}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}
