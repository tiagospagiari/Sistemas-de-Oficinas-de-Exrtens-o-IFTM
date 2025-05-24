"use client"

import { useEffect, useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { LocationService, City } from "@/lib/services/locationService"

interface CitySelectProps {
  uf: string
  value?: string
  onValueChange: (value: string) => void
  disabled?: boolean
}

export function CitySelect({ uf, value, onValueChange, disabled }: CitySelectProps) {
  const [open, setOpen] = useState(false)
  const [cities, setCities] = useState<City[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchCities = async () => {
      if (!uf) {
        setCities([])
        return
      }

      setLoading(true)
      try {
        const citiesList = await LocationService.getCitiesByState(uf)
        setCities(citiesList)
      } catch (error) {
        console.error('Erro ao buscar cidades:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCities()
  }, [uf])

  const selectedCity = cities.find(city => city.nome === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled || !uf || loading}
        >
          {loading ? "Carregando cidades..." : 
           value ? selectedCity?.nome : 
           "Selecione uma cidade"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Buscar cidade..." />
          <CommandEmpty>Nenhuma cidade encontrada.</CommandEmpty>
          <CommandGroup className="max-h-[300px] overflow-auto">
            {cities.map((city) => (
              <CommandItem
                key={city.id}
                value={city.nome}
                onSelect={() => {
                  onValueChange(city.nome)
                  setOpen(false)
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === city.nome ? "opacity-100" : "opacity-0"
                  )}
                />
                {city.nome}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
} 