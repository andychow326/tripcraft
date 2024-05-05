import json
from typing import List

import sqlalchemy as sa
from sqlalchemy.orm import Mapped, declarative_base, mapped_column, relationship

from tripcraft.schemas import Translations
from tripcraft.utils import chinese_simplified_to_traditional, to_chinese_simplified

Base = declarative_base()


class Region(Base):
    __tablename__ = "regions"

    id: Mapped[int] = mapped_column(sa.Integer, primary_key=True)
    name: Mapped[str] = mapped_column(sa.Text, nullable=False)

    sub_regions: Mapped[List["SubRegion"]] = relationship("SubRegion")
    countries: Mapped[List["Country"]] = relationship("Country")

    _translations: Mapped[str] = mapped_column(
        "translations", sa.Text, nullable=False, unique=True
    )

    @property
    def translations(self) -> Translations:
        translations = json.loads(self._translations)
        en = self.name
        zh_hans = translations["cn"] if "cn" in translations else self.name
        zh_hant = (
            chinese_simplified_to_traditional(translations["cn"])
            if "cn" in translations
            else self.name
        )

        return Translations(
            en=en,
            zh_hans=zh_hans,
            zh_hant=zh_hant,
        )


class SubRegion(Base):
    __tablename__ = "subregions"

    id: Mapped[int] = mapped_column(sa.Integer, primary_key=True)
    name: Mapped[str] = mapped_column(sa.Text, nullable=False)

    region_id: Mapped[int] = mapped_column(sa.ForeignKey("regions.id"), index=True)

    region: Mapped["Region"] = relationship(
        back_populates="sub_regions", foreign_keys=[region_id]
    )
    countries: Mapped[List["Country"]] = relationship("Country")

    _translations: Mapped[str] = mapped_column(
        "translations", sa.Text, nullable=False, unique=True
    )

    @property
    def translations(self) -> Translations:
        translations = json.loads(self._translations)
        en = self.name
        zh_hans = translations["chinese"] if "chinese" in translations else self.name
        zh_hant = (
            chinese_simplified_to_traditional(translations["chinese"])
            if "chinese" in translations
            else self.name
        )

        return Translations(
            en=en,
            zh_hans=zh_hans,
            zh_hant=zh_hant,
        )


class Country(Base):
    __tablename__ = "countries"

    id: Mapped[int] = mapped_column(sa.Integer, primary_key=True)
    name: Mapped[str] = mapped_column(sa.Text, nullable=False)
    iso3: Mapped[str] = mapped_column(sa.Text, nullable=True)
    iso2: Mapped[str] = mapped_column(sa.Text, nullable=True)
    capital: Mapped[str] = mapped_column(sa.Text, nullable=True)
    latitude: Mapped[float] = mapped_column(sa.Numeric, nullable=True)
    longitude: Mapped[float] = mapped_column(sa.Numeric, nullable=True)
    emoji: Mapped[str] = mapped_column(sa.Text, nullable=True)

    region_id: Mapped[int] = mapped_column(sa.ForeignKey("regions.id"), index=True)
    sub_region_id: Mapped[int] = mapped_column(
        "subregion_id", sa.ForeignKey("subregions.id"), index=True
    )

    region: Mapped["Region"] = relationship(
        back_populates="countries", foreign_keys=[region_id]
    )
    sub_region: Mapped["SubRegion"] = relationship(
        back_populates="countries", foreign_keys=[sub_region_id]
    )
    states: Mapped[List["State"]] = relationship("State")
    cities: Mapped[List["City"]] = relationship("City")

    _translations: Mapped[str] = mapped_column(
        "translations", sa.Text, nullable=False, unique=True
    )

    @property
    def translations(self) -> Translations:
        translations = json.loads(self._translations)
        en = self.name
        zh_hans = translations["cn"] if "cn" in translations else self.name
        zh_hant = (
            chinese_simplified_to_traditional(translations["cn"])
            if "cn" in translations
            else self.name
        )

        return Translations(
            en=en,
            zh_hans=zh_hans,
            zh_hant=zh_hant,
        )


class State(Base):
    __tablename__ = "states"

    id: Mapped[int] = mapped_column(sa.Integer, primary_key=True)
    name: Mapped[str] = mapped_column(sa.Text, nullable=False)
    latitude: Mapped[float] = mapped_column(sa.Numeric, nullable=True)
    longitude: Mapped[float] = mapped_column(sa.Numeric, nullable=True)

    country_id: Mapped[int] = mapped_column(sa.ForeignKey("countries.id"), index=True)

    country: Mapped["Country"] = relationship(
        back_populates="states", foreign_keys=[country_id]
    )
    cities: Mapped[List["City"]] = relationship("City")

    @property
    def translations(self) -> Translations:
        en = self.name
        zh_hans = to_chinese_simplified(en)
        zh_hant = chinese_simplified_to_traditional(zh_hans)

        return Translations(
            en=en,
            zh_hans=zh_hans,
            zh_hant=zh_hant,
        )


class City(Base):
    __tablename__ = "cities"

    id: Mapped[int] = mapped_column(sa.Integer, primary_key=True)
    name: Mapped[str] = mapped_column(sa.Text, nullable=False)
    latitude: Mapped[float] = mapped_column(sa.Numeric, nullable=True)
    longitude: Mapped[float] = mapped_column(sa.Numeric, nullable=True)

    state_id: Mapped[int] = mapped_column(sa.ForeignKey("states.id"), index=True)
    country_id: Mapped[int] = mapped_column(sa.ForeignKey("countries.id"), index=True)

    state: Mapped["State"] = relationship(
        back_populates="cities", foreign_keys=[state_id]
    )
    country: Mapped["Country"] = relationship(
        back_populates="cities", foreign_keys=[country_id]
    )

    @property
    def translations(self) -> Translations:
        en = self.name
        zh_hans = to_chinese_simplified(en)
        zh_hant = chinese_simplified_to_traditional(zh_hans)

        return Translations(
            en=en,
            zh_hans=zh_hans,
            zh_hant=zh_hant,
        )
